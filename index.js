// old method
// const express = require('express');
// const app = express();

// short method
// const app = require('express')();


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const supabaseURL = process.env.DATABASE_URL;
const supabaseKEY = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseURL, supabaseKEY);

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json()); // content type yang dikirim harus json
app.use(express.urlencoded({ extended: true })); // content type yang biasanya digunakan oleh form html (belum termasuk multipart/form-data)
app.use(cors()); // semua route dapat diakses oleh domain berbeda

// get all todo
app.get('/todos', async (req, res) => {
    try {
        const { error, data, status, statusText } = await supabase
            .from('todos')
            .select('*');
        if(error) {
            throw error;
        }
        res.status(status).json({
            status: statusText,
            data: data,
        });
    } catch (error) {
        res.status(500).json({ status: "Failed to fetch todos! " + error.message });
    }
});

// get specific todo
app.get('/todos/:id', async (req, res) => {
    try {
        const { error, data, status, statusText } = await supabase
            .from('todos')
            .select('*')
            .eq('id', req.params.id);
        if(error) {
            throw error;
        }
        res.status(status).json({
            status: statusText,
            data: data[0],
        });
    } catch (error) {
        res.status(500).json({ status: "Failed to fetch todos! " + error.message });
    }
});

// create todo
app.post('/todos', async(req, res) => {
    try {
        const dataTodo = req.body;
        const { error, data, status, statusText } = await supabase
            .from('todos')
            .insert(dataTodo);
        if(error) {
            throw error;
        }
        res.status(status).json({
            status: statusText,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to create todo! " + error.message });
    }
});

// update todo
app.put('/todos/:id', async(req, res) => {
    try {
        const dataTodo = req.body;
        const { error, data, status, statusText } = await supabase
            .from('todos')
            .update(dataTodo)
            .eq('id', req.params.id);
        if(error) {
            throw error;
        }
        res.status(200).json({
            status: statusText,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to create todo! " + error.message });
    }
});


app.delete('/todos/:id', async (req, res) => {
    try {
        const { error, data, status, statusText } = await supabase
            .from('todos')
            .delete()
            .eq('id', req.params.id);
        if(error) {
            throw error;
        }
        res.status(200).json({
            status: statusText,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete todo! " + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on [http://localhost:${PORT}]`)
});