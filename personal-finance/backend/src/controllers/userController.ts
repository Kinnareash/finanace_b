import Transaction from "../models/Transaction";
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    await Transaction.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: "Account and all data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
import { Request, Response } from "express";
import User from "../models/User";

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true, context: 'query' }
    ).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
