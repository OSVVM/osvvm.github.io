# Open Source VHDL Verification Methodology (OSVVM)
Open Source VHDL Verification Methodology (OSVVM) provides utisimplifies your FPGA and ASIC verification tasks by providing utility and model libraries.
Using these libraries one can create a simple, readable, and 
powerful testbench that is suitable for either a simple FPGA block
or a complex ASIC.

## OSVVM is the #1 VHDL Verification Methodology 
According to the [2018 Wilson Verification Survey](https://blogs.mentor.com/verificationhorizons/blog/2019/01/15/part-6-the-2018-wilson-research-group-functional-verification-study/), OSVVM is the:
 - #1 VHDL Verification Methodology
 - #1 FPGA Verification Methodology in Europe (ahead of SystemVerilog + UVM)

## The OSVVM Utility Library 
The [OSVVM utility library](https://github.com/OSVVM/OSVVM) offers the same capabilities as those provided by other verification languages (such as SystemVerilog and UVM):

 - Transaction-Level Modeling
 - Constrained Random test generation
 - Functional Coverage with hooks for UCIS coverage database integration
 - Intelligent Coverage Random test generation
 - Utilities for testbench process synchronization generation
 - Utilities for clock and reset generation
 - Transcript files
 - Error logging and reporting - Alerts and Affirmations
 - Message filtering - Logs
 - Scoreboards and FIFOs (data structures for verification)
 - Memory models
 
## The OSVVM Model Library
The OSVVM model library is a growing set of models 
commonly used for FPGA and ASIC verification.  
The library currently contains the following repositories:

 - [Verification IP](https://github.com/OSVVM/VerificationIP)
   - Repository that includes all Verification IP as a submodule. 
   - Note submodules do not get included in the GitHub zip files, instead check out with:  
        `$ git clone --recursive https://github.com/OSVVM/VerificationIP.git`
 - [AXI4 Lite](https://github.com/OSVVM/AXI4)
   - Master
   - Slave transactor model
 - [AXI Stream](https://github.com/OSVVM/AXI4)
   - Master
   - Slave
 - [UART](https://github.com/OSVVM/AXI4)
   - Transmitter (aka master) - with error injection
   - Receiver (aka slave) - with error injection
 - [OSVVM Common - Required](https://github.com/OSVVM/OSVVM-Common)
   - Shared transcript interfaces
 - [OSVVM Scripts](https://github.com/OSVVM/OSVVM-Scripts)
   - Recommended.  Script layer on top of tcl
   - Common simulator compilation and execution methodology

We use the word models as short hand for 
Transaction Based Models (TBM). 
They are simply an entity and architecture coded in 
an effective manner for verification.
Some use other terminology such as 
VHDL verification components (VVC) - 
these are the same thing.
Historically we used Bus Functional Models (BFM). 
However, recently we abandoned BFM due to others using BFM to 
refer to their own lesser capable subprogram based approach.

OSVVM models use records for the transaction interfaces, 
so connecting them to your testbench is simple - 
connect only a single signal.

Testbenches are in the Git repository, so you can 
run a simulation and see a live example 
of how to use the models.
