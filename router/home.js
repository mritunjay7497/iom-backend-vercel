const { connections } = require("mongoose");

const express = require('express');

async function home(req,res){
    res.send("Welcome to IOM ");
};

module.exports = home;