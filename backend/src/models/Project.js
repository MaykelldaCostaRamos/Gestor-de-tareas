import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  date: {
    type: Date
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",       // referencia al modelo User
    required: true
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"      // referencia a otros usuarios que colaboran
    }
  ]
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
