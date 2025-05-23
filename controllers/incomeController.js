const User = require ("../models/User");
const xlsx = require("xlsx")
const Income = require("../models/Income")
// add income source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body

        //validation
        if(!source || !amount || !date) {
            return res.status(400).json({message:"All fields are required"})
        }
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date : new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (err){
           res.status(500).json({message:"Internal server error"})
    }
}

// getAll income source
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({userId}).sort({date: -1});
        res.json(income);
    }catch (err){
        res.status(500).json({message:"Internal server error"})
    }
}

// delete income source
exports.deleteIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message:"Income deleted successfully"});
    }catch (err){
        res.status(500).json({message:"Internal server error"});
    }
};

//download income excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        // Preparing data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date.toISOString().split("T")[0],
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");

        const filePath = "income_detail.xlsx"; // File name
        xlsx.writeFile(wb, filePath);

        res.download(filePath, (err) => {
            if (err) {
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

