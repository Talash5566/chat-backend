
import Conversation from '../Models/conversationschema.js';
import User from '../Models/userschema.js'

export const searchuser = async(req,res)=>{
    try {
        const currentuerId = req.user.id ;
        const search = req.query.search || '';

        const users = await User.find({
            $and: [
              {
                $or: [
                  { username: { $regex: '.*' + search + '.*', $options: 'i' } },
                  { fullname: { $regex: '.*' + search + '.*', $options: 'i' } }
                ]
              },
              {
                _id: { $ne: currentuerId }
              }
            ]
          }).select("-password -email");
          

        res.status(200).json(users);
    } catch (error) {
        res.status(400).json(error,{sucess:false})
    }
}

export const chattingusers = async (req, res) => {
  try {
    const currentuerId = req.user.id;

    if (!currentuerId) {
      return res.status(401).json({ message: "Unauthorized - User ID missing" });
    }

    const currentchatters = await Conversation.find({
      participants: currentuerId,
    }).sort({ updatedAt: -1 });

    if (!currentchatters || currentchatters.length === 0) {
      return res.status(200).json([]);
    }

    
    const participantsIDS = currentchatters.reduce((ids, conversation) => {
      const others = conversation.participants.filter(
        (id) => id && id.toString() !== currentuerId.toString()
      );
      return [...ids, ...others];
    }, []);

    const uniqueIds = [...new Set(participantsIDS.map((id) => id.toString()))];

    const users = await User.find({
      _id: { $in: uniqueIds },
    }).select("-password -email");

  
    const sortedUsers = uniqueIds.map((id) =>
      users.find((u) => u._id.toString() === id)
    );

    res.status(200).json(sortedUsers.filter(Boolean));
  } catch (err) {
    console.error("Error in chattingUsers route:", err);
    res.status(500).json({ error: "Server error" });
  }
};
