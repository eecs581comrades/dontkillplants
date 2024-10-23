#!/bin/bash

# Check if MySQL is installed, if not install it
if ! command -v mysql &> /dev/null
then
    echo "MySQL not found. Installing..."
    brew install mysql
    brew services start mysql
else
    echo "MySQL is already installed."
fi
