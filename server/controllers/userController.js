import userModel from "../models/userModel.js";

export const getUserData  =  async (req, res) => {
    try {
        // Use req.userId set by middleware, not req.body.userId
        const userId = req.userId;
        const user = await userModel.findById(userId); // Exclude sensitive fields
        if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
        }
    
        return res.status(200).json({ success: true, userData:{
            name: user.name,
            isAccountVerified: user.isAccountVerified
            
        }});
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
    }