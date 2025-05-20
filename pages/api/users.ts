/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';

interface UserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: string;
  password: string;
  permissions: string[];
  role: string;
  agreeTerms: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await dbConnect.connect();

    switch (req.method) {
      case 'GET':
        return getHandler(req, res);
      case 'POST':
        return postHandler(req, res);
      case 'DELETE':
        return deleteHandler(req, res);
      case 'PUT':
        return updateHandler(req, res);
      default:
        res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getHandler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const users = await UserModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function postHandler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { firstName, lastName, email, phone, profilePicture, password, permissions, role, agreeTerms } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ firstName, lastName, email, phone, profilePicture, password: hashedPassword, permissions, role, agreeTerms });
    console.log(newUser)
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function deleteHandler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const id = req.query.id as string;

    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function updateHandler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const id = req.query.id as string;
    const {
      firstName, lastName, email, phone, profilePicture, password, permissions, role
    }: UserRequestBody = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        phone,
        profilePicture,
        password,
        permissions,
        role,
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
