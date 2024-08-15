## Oracle OCI CLI Setup Guide

This guide will help you install and configure the Oracle OCI CLI on your system, as well as configure your OCI environment using oci-setup.

# Prerequisites

Before you begin, ensure you have the following:

1. A working installation of Python 3.10 or later.
2. Access to your Oracle Cloud account with API keys generated (if you don’t have one, you’ll be guided through generating one during setup).

# Step 1: Install the OCI CLI

The Oracle Cloud Infrastructure Command Line Interface (OCI CLI) is a tool for interacting with Oracle Cloud services. it allows you to access and configure all resources

# 1.1 Install Using the Install Script (Recommended but you can also use brew)

The easiest way to install the OCI CLI is to use the provided install script:

1. Open your terminal (Command Prompt, PowerShell, or any UNIX shell).
2.	Run the following command:

```bash
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"
```

# 3.	Follow the on-screen prompts to complete the installation.

1.2 Manual Installation (Alternative)

Alternatively, you can install the OCI CLI manually:

1. Install the CLI using pip:

```bash
pip install oci-cli
```

# Step 2: Configure the OCI CLI

After installing the OCI CLI, you need to configure it with your Oracle Cloud account details.

2.1 Run oci-setup

1. In your terminal, run the following command to start the configuration process:
 
```bash
oci setup config
```

2.	The setup process will prompt you for the following information:
```
	•	User OCID: Your user’s unique identifier in Oracle Cloud.
	•	Tenancy OCID: The unique identifier of your Oracle Cloud tenancy.
	•	Region: The region you want to connect to (e.g., us-ashburn-1).
	•	Compartment OCID: The compartment where your resources are stored (optional).
	•	API Key: The path to your API private key file (will be generated during setup if not provided).
	•	Fingerprint: A unique identifier for your API key (will be generated during setup if not provided).
```
3.	If you don’t have an API key, the setup will generate one for you and help you upload the public key to your Oracle Cloud account.
4.	Once the setup is complete, your configuration will be saved in the ~/.oci/config file.


# 2.2 Test Your Configuration

After setup, you can test your configuration by running a simple OCI command:

```bash
oci os ns get
```
This command retrieves your tenancy’s namespace, which is a unique identifier for your Object Storage resources.

# Step 3: Common OCI CLI Commands

Here are a few common OCI CLI commands to get you started:

List all compartments:

```bash
 oci iam compartment list --all
```
# List all buckets in a compartment:

```bash
oci os bucket list --compartment-id <your-compartment-ocid>
```

# Upload a file to Object Storage:

```bash
oci os object put --bucket-name <your-bucket-name> --file <your-file-path>
```

# Download a file from Object Storage:

```bash
oci os object get --bucket-name <your-bucket-name> --name <object-name> --file <destination-file-path>
```
Additional Resources

https://docs.oracle.com/en-us/iaas/Content/API/Concepts/cliconcepts.htm
