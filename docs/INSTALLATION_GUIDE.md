# Seed Sowing Robot - Installation Guide

## Table of Contents
1. System Requirements
2. Hardware Installation
3. Software Installation
4. Network Configuration
5. AWS Setup
6. Mobile App Installation
7. Initial Calibration
8. Verification

## 1. System Requirements

### 1.1 Development Machine
- Ubuntu 20.04 LTS or Debian 11+
- Python 3.8+
- Node.js 14+
- 8GB RAM minimum
- 50GB free disk space

### 1.2 Robot Hardware
- Raspberry Pi 4 (4GB RAM minimum)
- Arduino Mega 2560
- ESP32 DevKit
- RTK GPS module
- Required sensors (see hardware specs)
- Power supply system

### 1.3 Mobile Device
- iOS 12+ or Android 8+
- Bluetooth 4.0+
- GPS enabled
- 2GB RAM minimum

## 2. Hardware Installation

### 2.1 Power System
1. Install battery pack in designated compartment
2. Connect to main power distribution board
3. Install DC-DC converters
4. Connect solar panel (optional)
5. Install battery management system

### 2.2 Control Electronics
1. Mount Raspberry Pi in control box
2. Install Arduino Mega
3. Install ESP32 module
4. Connect communication cables
5. Install cooling fans

### 2.3 Sensors
1. Mount GPS antenna at highest point
2. Install IMU near center of mass
3. Mount ultrasonic/LiDAR sensors
4. Install camera module
5. Connect environmental sensors

### 2.4 Actuators
1. Install drive motors
2. Connect motor drivers
3. Install seed dispenser motor
4. Install drilling mechanism
5. Install water pump

### 2.5 Wiring
1. Follow wiring diagram
2. Use appropriate gauge wire
3. Secure all connections
4. Label all wires
5. Test continuity

## 3. Software Installation

### 3.1 Robot Software (Raspberry Pi)

#### 3.1.1 Operating System
```bash
# Flash Raspberry Pi OS (64-bit)
# Use Raspberry Pi Imager or balenaEtcher

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y git python3-pip python3-dev \
    build-essential cmake pkg-config
```

#### 3.1.2 Python Dependencies
```bash
# Navigate to robot software directory
cd ~/seed-sowing-robot/robot_software

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

#### 3.1.3 ROS Installation (Optional)
```bash
# Add ROS repository
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'

# Add keys
sudo apt install curl
curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo apt-key add -

# Install ROS Noetic
sudo apt update
sudo apt install ros-noetic-desktop-full

# Initialize rosdep
sudo rosdep init
rosdep update

# Setup environment
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

### 3.2 Firmware Installation

#### 3.2.1 Arduino Firmware
```bash
# Install Arduino CLI
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

# Install required libraries
arduino-cli lib install "Adafruit Motor Shield V2"
arduino-cli lib install "Adafruit GPS Library"
arduino-cli lib install "PID"

# Compile and upload
cd ~/seed-sowing-robot/firmware/arduino_master
arduino-cli compile --fqbn arduino:avr:mega
arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:avr:mega
```

#### 3.2.2 ESP32 Firmware
```bash
# Install PlatformIO
pip install platformio

# Navigate to ESP32 firmware
cd ~/seed-sowing-robot/firmware/esp32_iot

# Build and upload
platformio run --target upload
```

### 3.3 Cloud Backend

#### 3.3.1 Local Development
```bash
# Navigate to backend directory
cd ~/seed-sowing-robot/cloud_backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your settings

# Run backend locally
python src/app.py
```

#### 3.3.2 AWS Deployment
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure

# Deploy infrastructure
cd infrastructure/terraform
terraform init
terraform plan
terraform apply

# Deploy Lambda functions
cd ../lambda_functions
./deploy.sh
```

## 4. Network Configuration

### 4.1 WiFi Setup
```bash
# Configure WiFi on Raspberry Pi
sudo raspi-config
# Select Network Options > WiFi

# Set static IP (optional)
sudo nano /etc/dhcpcd.conf
# Add:
# interface wlan0
# static ip_address=192.168.1.100/24
# static routers=192.168.1.1
# static domain_name_servers=8.8.8.8
```

### 4.2 Bluetooth Configuration
```bash
# Install Bluetooth tools
sudo apt install bluetooth bluez bluez-tools

# Enable Bluetooth
sudo systemctl start bluetooth
sudo systemctl enable bluetooth

# Make discoverable
sudo bluetoothctl
# In bluetoothctl:
# agent on
# discoverable on
# pairable on
```

### 4.3 MQTT Configuration
```bash
# Install Mosquitto broker (for local testing)
sudo apt install mosquitto mosquitto-clients

# Start broker
sudo systemctl start mosquitto
sudo systemctl enable mosquitto

# Test connection
mosquitto_sub -h localhost -t test/topic
```

## 5. AWS Setup

### 5.1 IoT Core Configuration
```bash
# Create IoT Thing
aws iot create-thing --thing-name seed-robot-001

# Create and attach certificate
aws iot create-keys-and-certificate \
    --set-as-active \
    --certificate-pem-outfile cert.pem \
    --public-key-outfile public.key \
    --private-key-outfile private.key

# Attach policy
aws iot attach-policy \
    --policy-name RobotPolicy \
    --target <certificate-arn>

# Download root CA
wget https://www.amazontrust.com/repository/AmazonRootCA1.pem
```

### 5.2 DynamoDB Tables
```bash
# Create telemetry table
aws dynamodb create-table \
    --table-name RobotTelemetry \
    --attribute-definitions \
        AttributeName=robot_id,AttributeType=S \
        AttributeName=timestamp,AttributeType=N \
    --key-schema \
        AttributeName=robot_id,KeyType=HASH \
        AttributeName=timestamp,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST

# Create sessions table
aws dynamodb create-table \
    --table-name PlantingSessions \
    --attribute-definitions \
        AttributeName=session_id,AttributeType=S \
    --key-schema \
        AttributeName=session_id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
```

### 5.3 S3 Buckets
```bash
# Create data bucket
aws s3 mb s3://seed-robot-data

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket seed-robot-data \
    --versioning-configuration Status=Enabled

# Set lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
    --bucket seed-robot-data \
    --lifecycle-configuration file://lifecycle.json
```

## 6. Mobile App Installation

### 6.1 Development Setup
```bash
# Navigate to mobile app directory
cd ~/seed-sowing-robot/mobile_app

# Install dependencies
npm install

# Install iOS dependencies (Mac only)
cd ios && pod install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with API endpoints and keys
```

### 6.2 Android Build
```bash
# Build APK
npx react-native build-android --mode=release

# Install on device
adb install android/app/build/outputs/apk/release/app-release.apk
```

### 6.3 iOS Build
```bash
# Open in Xcode
open ios/SeedRobot.xcworkspace

# Configure signing
# Build and run on device
```

## 7. Initial Calibration

### 7.1 GPS Calibration
```bash
# Run GPS calibration script
cd ~/seed-sowing-robot/robot_software/scripts
python calibration.py --module gps

# Follow prompts for base station setup
# Record calibration parameters
```

### 7.2 Motor Calibration
```bash
# Calibrate drive motors
python calibration.py --module motors

# Test forward/backward
# Test turning radius
# Save calibration values
```

### 7.3 Sensor Calibration
```bash
# Calibrate IMU
python calibration.py --module imu

# Calibrate soil moisture sensors
python calibration.py --module soil

# Calibrate environmental sensors
python calibration.py --module environmental
```

### 7.4 Seed Dispenser Calibration
```bash
# Calibrate seed counter
python calibration.py --module dispenser

# Test with actual seeds
# Verify count accuracy
# Adjust parameters as needed
```

## 8. Verification

### 8.1 System Check
```bash
# Run comprehensive system check
cd ~/seed-sowing-robot/robot_software/scripts
python system_check.py

# Verify all subsystems
# Check for errors
# Review log output
```

### 8.2 Communication Test
```bash
# Test serial communication
python -c "from robot_software.src.communication.serial_interface import *; test_serial()"

# Test MQTT connection
python -c "from robot_software.src.communication.mqtt_client import *; test_mqtt()"

# Test mobile app connection
# Open mobile app
# Verify connection status
```

### 8.3 Test Run
```bash
# Start robot software
cd ~/seed-sowing-robot/robot_software
python src/main.py

# Open mobile app
# Create small test mission
# Monitor operation
# Verify all functions
```

## 9. Troubleshooting Installation

### 9.1 Common Issues

#### Python dependencies fail
```bash
# Install system dependencies
sudo apt install python3-dev libatlas-base-dev

# Update pip
pip install --upgrade pip setuptools wheel
```

#### GPS not detected
```bash
# Check USB connection
lsusb

# Check serial port permissions
sudo usermod -a -G dialout $USER
# Log out and back in
```

#### Firmware upload fails
```bash
# Check board connection
ls /dev/tty*

# Reset board
# Try different USB port
# Check for driver issues
```

#### AWS connection fails
```bash
# Verify credentials
aws sts get-caller-identity

# Check certificate permissions
chmod 644 cert.pem
chmod 600 private.key

# Test MQTT connection
mosquitto_pub -h <iot-endpoint> \
    --cert cert.pem \
    --key private.key \
    --cafile AmazonRootCA1.pem \
    -t test/topic \
    -m "test"
```

## 10. Next Steps

After successful installation:
1. Complete User Manual training
2. Perform test operations in controlled area
3. Gradually increase operational complexity
4. Establish maintenance schedule
5. Join user community for support

## Support
For installation issues:
- Email: support@seedrobot.com
- Documentation: docs.seedrobot.com
- Forum: community.seedrobot.com
