const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./userRoutes');
const dataRoutes = require('./dataRoutes');
const authRoutes = require('./auth');
//const questionRoutes = require('./question');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const csvParser = require('csv-parser');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Together = require('together-ai');
const { writeFile, createObjectCsvWriter } = require('xlsx'); // Import your required libraries
const { Document, Packer, Paragraph, TextRun } = require('docx'); // For DOCX
const pdfkit = require('pdfkit'); // For PDF

dotenv.config();
const app = express();
// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
}));
app.use(express.json());


mongoose.connect('mongodb+srv://monica_g:MOWNICA%402021%23dk@cluster0.ttftc.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

app.use('/users', userRoutes);
// Routes
app.use('/auth', authRoutes);
//app.use('/questions', questionRoutes);
// Feedback Route
app.post('/feedback', (req, res) => {
  // Implement feedback handling here, e.g., save to DB or send email
  res.json({ message: 'Feedback received' });
});

// Define your /data route
app.get('/data', async (req, res) => {
  try {
    const users = await User.find();
    const feedback = await Feedback.find();
    res.status(200).json({ users, feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

  


require('dotenv').config();

// Initialize Together API
const together = new Together({ apiKey:'fe26c8c4a2667aa3c4e433f3146caa65d9bd1328e9fcb8288e781d1b21908be5' });

/*const app = express();*/

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); // Middleware for handling file uploads

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Handle file upload and question generation
app.post('/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No file was uploaded.');
    }

    const uploadedFile = req.files.file;
    const filePath = path.join(uploadsDir, uploadedFile.name); // Save file in uploads directory
    const { topic, numQuestions, questionType, difficulty } = req.body; // Get form data

    // Save the uploaded file
    uploadedFile.mv(filePath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        const fileExtension = path.extname(uploadedFile.name);

        // Handle different file types
        switch (fileExtension) {
            case '.xlsx':
                readXlsxFile(filePath, topic, numQuestions, questionType, difficulty, res);
                break;
            case '.csv':
                readCsvFile(filePath, topic, numQuestions, questionType, difficulty, res);
                break;
            case '.pdf':
                readPdfFile(filePath, topic, numQuestions, questionType, difficulty, res);
                break;
            case '.docx':
                readDocxFile(filePath, topic, numQuestions, questionType, difficulty, res);
                break;
            default:
                console.log('Unsupported file type.');
                res.status(400).send('Unsupported file type.');
        }
    });
});

// Read Excel file (.xlsx)
function readXlsxFile(filePath, topic, numQuestions, questionType, difficulty, res) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    const extractedText = JSON.stringify(data);
    sendToTogetherAPI(extractedText, topic, numQuestions, questionType, difficulty, res);
}

// Read CSV file (.csv)
function readCsvFile(filePath, topic, numQuestions, questionType, difficulty, res) {
    const results = [];
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const extractedText = JSON.stringify(results);
            sendToTogetherAPI(extractedText, topic, numQuestions, questionType, difficulty, res);
        });
}

// Read PDF file (.pdf)
async function readPdfFile(filePath, topic, numQuestions, questionType, difficulty, res) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    sendToTogetherAPI(data.text, topic, numQuestions, questionType, difficulty, res);
}

// Read Word document (.docx)
async function readDocxFile(filePath, topic, numQuestions, questionType, difficulty, res) {
    const data = await mammoth.extractRawText({ path: filePath });
    sendToTogetherAPI(data.value, topic, numQuestions, questionType, difficulty, res);
}

// Send the extracted content to Together AI for question generation
async function sendToTogetherAPI(extractedContent, topic, numQuestions, questionType, difficulty, res) {
    let prompt;

    if (questionType === 'Subjective') {
        prompt = `Generate exactly ${numQuestions} subjective question${numQuestions > 1 ? 's' : ''} with difficulty as ${difficulty}. The questions are on the topic of "${topic}" based on the following content:\n${extractedContent}\n\nReturn the output strictly in JSON format. Each question should have the following structure:
        [
            {
                "question": "string",
                "answer": "string"
            }
        ]

        Please ensure the total number of questions generated is equal to ${numQuestions}. Provide no extra information, explanations, or additional text. Additionally in the subjective section the answer should never be empty, null or none. It always should have a valid answer.`;
    } else {
        prompt = `Generate exactly ${numQuestions} objective question${numQuestions > 1 ? 's' : ''} with difficulty as ${difficulty}. The question type is ${questionType}, and the questions are on the topic of "${topic}" based on the following content:\n${extractedContent}\n\nReturn the output strictly in JSON format. Each question should have the following structure:
        [
            {
                "question": "string",
                "options": ["option1", "option2", "option3", "option4"],
                "correct_answer": "string"
            }
        ]

        Please ensure the total number of questions generated is equal to ${numQuestions}. Provide no extra information, explanations, or additional text.`;
    }

    try {
        const response = await together.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: prompt
                }
            ],
            model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
            max_tokens: 51200,
            temperature: 0.7,
            top_p: 0.7,
            top_k: 50,
            repetition_penalty: 1,
            stop: ["<|eot_id|>", "<|eom_id|>"],
            stream: false
        });

        // Send the generated questions back to the frontend
        console.log(response.choices[0].message.content);
        res.json(JSON.parse(response.choices[0].message.content));

    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).send('Error processing the request');
    }
}


app.post('/download', async (req, res) => {
    const { format, questions } = req.body;

    try {
        if (format === 'xlsx') {
            // Generate XLSX
            const modifiedQuestions = questions.map(q => {
                if (q.options) {
                    return {
                        question: q.question,
                        options: q.options.join('; '), // Convert options array to string
                        correct_answer: q.correct_answer,
                        // Add any other fields you want
                    };
                } else {
                    return {
                        question: q.question,
                        answer: q.answer,
                        // Add any other fields you want
                    };
                }
            });
            
            const ws = xlsx.utils.json_to_sheet(modifiedQuestions);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Questions');
            const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
        
            res.setHeader('Content-Disposition', 'attachment; filename=questions.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
        else if (format === 'csv') {
            const modifiedQuestions = questions.map(q => {
                if (q.options) {
                    return {
                        question: q.question,
                        options: q.options.join('; '), // Convert options array to string
                        correct_answer: q.correct_answer,
                        answer: '', // No answer for objective questions
                    };
                } else {
                    return {
                        question: q.question,
                        options: '', // Keep options field empty for subjective questions
                        correct_answer: '', // Keep correct_answer field empty for subjective questions
                        answer: q.answer, // Include the subjective answer
                    };
                }
            });
        
            // Prepare CSV records based on content
            const filteredRecords = modifiedQuestions.map(record => {
                // Create an object that only includes non-empty fields
                const csvRecord = {
                    question: record.question,
                };
        
                // Only include 'options' and 'correct_answer' if they are not empty
                if (record.options) csvRecord.options = record.options;
                if (record.correct_answer) csvRecord.correct_answer = record.correct_answer;
                if (record.answer) csvRecord.answer = record.answer;
        
                return csvRecord;
            });
        
            // Determine headers based on the presence of data in filteredRecords
            const headers = [
                { id: 'question', title: 'Question' },
                { id: 'options', title: 'Options' },
                { id: 'correct_answer', title: 'Correct Answer' },
                { id: 'answer', title: 'Subjective Answer' },
            ].filter(header => filteredRecords.some(record => record[header.id])); // Filter headers based on existing data
        
            const csvWriter = require('csv-writer').createObjectCsvWriter({
                path: 'questions.csv',
                header: headers
            });
        
            // Write the filtered records to the CSV file
            await csvWriter.writeRecords(filteredRecords);
            res.download('questions.csv'); // Send CSV file as download
        }
        
         else if (format === 'pdf') {
            // Generate PDF
            const doc = new pdfkit();
            const filePath = 'questions.pdf';
            doc.pipe(fs.createWriteStream(filePath));
            
            questions.forEach(q => {
                doc.fontSize(12).text(`Question: ${q.question}`);
                
                if (q.options) {
                    doc.fontSize(10).text('Options:');
                    q.options.forEach((option, index) => {
                        doc.text(`${index + 1}. ${option}`);
                    });
                    doc.text(`Correct Answer: ${q.correct_answer}\n`); // Add correct answer
                } else {
                    doc.text(`Answer: ${q.answer}\n`); // For subjective questions
                }
            });
            
            doc.end();
            res.download(filePath); // Send PDF file as download
        }
        else if (format === 'docx') {
            // Create a new document
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [] // Initialize with an empty children array
                }],
            });
        
            // Initialize an array to hold all paragraphs
            const paragraphs = [];
        
            // Loop through each question and add it to the document
            questions.forEach(q => {
                // Add question paragraph
                paragraphs.push(new Paragraph({
                    children: [
                        new TextRun(`Question: ${q.question}`),
                    ],
                }));
        
                // Add a line break after the question
                paragraphs.push(new Paragraph({
                    children: [
                        new TextRun('\n'), // Line break
                    ],
                }));
        
                if (q.options) {
                    // Add options paragraph
                    paragraphs.push(new Paragraph({
                        children: [
                            new TextRun(`Options: ${q.options.join(', ')}`),
                        ],
                    }));
        
                    // Add a line break after the options
                    paragraphs.push(new Paragraph({
                        children: [
                            new TextRun('\n'), // Line break
                        ],
                    }));
        
                    // Add correct answer paragraph
                    paragraphs.push(new Paragraph({
                        children: [
                            new TextRun(`Correct Answer: ${q.correct_answer}`),
                        ],
                    }));
        
                    // Add a line break for spacing between questions
                    paragraphs.push(new Paragraph({
                        children: [
                            new TextRun('\n'), // Line break
                        ],
                    }));
                } else {
                    // Add answer paragraph for subjective questions
                    paragraphs.push(new Paragraph({
                        children: [
                            new TextRun(`Answer: ${q.answer}`),
                        ],
                    }));
        
                    // Add a line break for spacing between questions
                    paragraphs.push(new Paragraph({
                        children: [
                            new TextRun('\n'), // Line break
                        ],
                    }));
                }
            });
        
            // Add all paragraphs to the document in one go
            doc.addSection({ children: paragraphs });
        
            // Finalize the document
            const buffer = await Packer.toBuffer(doc);
            res.setHeader('Content-Disposition', 'attachment; filename=questions.docx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(buffer);
        }
        
        
        
    
         else {
            res.status(400).send('Unsupported file format.');
        }
    } catch (error) {
        console.error('Error generating file:', error);
        res.status(500).send('Error generating file.');
    }
});

// const mongoURI = 'mongodb+srv://monica_g:MOWNICA%402021%23dk@cluster0.ttftc.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// Feedback model
const feedbackSchema = new mongoose.Schema({
    comment: String,
    rating: Number
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Endpoint to get all feedbacks
app.get('/api/feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({});
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
});

// Endpoint to analyze feedbacks
app.get('/api/feedbacks/analysis', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({});
        const totalFeedbacks = feedbacks.length;

        const positiveFeedbacks = feedbacks.filter(feedback => feedback.rating >= 4).length;
        const negativeFeedbacks = feedbacks.filter(feedback => feedback.rating <= 2).length;

        const analysisResult = {
            total: totalFeedbacks,
            positive: positiveFeedbacks,
            negative: negativeFeedbacks,
        };

        res.json(analysisResult);
    } catch (error) {
        console.error('Error analyzing feedbacks:', error);
        res.status(500).json({ error: 'Failed to analyze feedbacks' });
    }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







