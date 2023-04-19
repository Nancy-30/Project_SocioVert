const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Community = require('../models/Community');

// Create a new community
router.post('/communities', async (req, res) => {
  try {
    const community = new Community(req.body);
    await community.save();
    res.status(201).send(community);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get all communities
router.get('/communities', async (req, res) => {
  try {
    const communities = await Community.find();
    res.send(communities);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get a community by ID
router.get('/communities/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).send('Community not found');
    }
    res.send(community);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Update a community by ID
router.patch('/communities/:id', async (req, res) => {
  try {
    const community = await Community.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!community) {
      return res.status(404).send('Community not found');
    }
    res.send(community);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Delete a community by ID
router.delete('/communities/:id', async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community) {
      return res.status(404).send('Community not found');
    }
    res.send(community);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Join a community by ID
router.post('/communities/:id/join', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).send('Community not found');
    }
    if (user.communities.includes(community._id)) {
      return res.status(400).send('User is already a member of this community');
    }
    user.communities.push(community._id);
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.post('/communities/:id/leave', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).send('Community not found');
    }
    if (!user.communities.includes(community._id)) {
      return res.status(400).send('User is not a member of this community');
    }
    user.communities = user.communities.filter(id => id !== community._id);
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;