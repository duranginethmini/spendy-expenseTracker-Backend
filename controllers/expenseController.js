const User = require ("../models/User");
const xlsx = require("xlsx")
const Expense = require("../models/Expense")
// add expense source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body

        //validation
        if(!category || !amount || !date) {
            return res.status(400).json({message:"All fields are required"})
        }
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date : new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (err){
        res.status(500).json({message:"Internal server error"})
    }
}

// getAll expense sources
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        res.json(expense);
    }catch (err){
        res.status(500).json({message:"Internal server error"})
    }
}

// delete expense source
exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message:"Expense deleted successfully"});
    }catch (err){
        res.status(500).json({message:"Internal server error"});
    }
};

//download expense excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Preparing data for Excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date.toISOString().split("T")[0],
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        const filePath = "expense_detail.xlsx"; // File name
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

