import User from '../Models/userschema.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
export const registerUser = async (req, res) => {
    const { fullname, email, username, age, gender, password, profilepic } = req.body;

    try {
        const existuser = await User.findOne({ email });
        if (existuser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        const olduser = await User.findOne({ username });
        if (olduser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const defaultimg = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            username,
            age,
            gender,
            password: hashedPassword,
            profilepic: profilepic || defaultimg
        });

        const user = await newUser.save();

        const token = jwt.sign(
            { username: user.username, id: user._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            user: {
              _id: user._id,
              fullname: user.fullname,
              username: user.username,
              email: user.email,
              profilepic: user.profilepic,
            },
            token
          });
          

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", sucess:false });
    }
};
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "No user found with this email" });
        }

        const validity = await bcrypt.compare(password, user.password);
        if (!validity) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = jwt.sign(
            {
                username: user.username,
                id: user._id
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ 
            _id:user._id ,
            fullname:user.fullname,
            username:user.username,
            profilepic:user.profilepic,
            email:user.email,
            message:"Login sucessful",
            token:token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Something went wrong",
            sucess:false
         });
    }
};

