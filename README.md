# Open Source VHDL Verification Methodology (OSVVM)
Open Source VHDL Verification Methodology (OSVVM) reduces the complexity of your verification task by providing utility and model libraries.

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
The OSVVM model library provides off the shelf models for:

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
 - [OSVVM Scripts](https://github.com/OSVVM/OSVVM-Common/tree/master/src)
   - Recommended.  Script layer on top of tcl
   - Common simulator compilation and execution methodology
 - Verification IP is intended to include the above as submodules, but currently something is broken in the linking in GitHub.
