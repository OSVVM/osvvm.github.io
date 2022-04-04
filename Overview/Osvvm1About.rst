About OSVVM
####################################################

.. image:: ../_static/logo_full_size.png
   :width: 500 px
   :align: center
   :target: https://github.com/OSVVM

About OSVVM
====================================================

OSVVM is an advanced verification methodology that
defines a verification framework, VHDL utility library,
VHDL verification component library, and a scripting library.

OSVVM supports the same capabilities that verification languages
such as SystemVerilog + UVM support - including transaction level modeling,
verification components, functional coverage, constrained random tests,
Intelligent Coverage random tests,
data structures (such as scoreboards, FIFOs, and Memories),
error logging and reporting, message filtering, and
advanced test reporting (HTML and JUnit XML for CI/CD).

Important benefits of OSVVM:

* Each piece is independent
    * Add them to your current VHDL testbench incrementally.

* Verification framework that is
    * Simple enough to use on small blocks
    * So simple in fact that we don't need a "Lite" or "Easy" approach
    * It is powerful enough to use on large, complex FPGAs and ASICs
    * Using the same framework architecture for RTL, Core, and System tests facilitates reuse between them
    * Test cases are readable by RTL, verification, software, and system engineers
    * We don't use OO language constructs so RTL engineers can write test environments
    * Our Model Independent Transactions (MIT) define a common set of transactions for Address Bus and Streaming Interfaces

* Utility Library
    * Simplifies Self-checking, Error handling, and Message Filtering
    * Constrained Random, Functional Coverage, Scoreboards, FIFOs, Memory Models
    * Capabilities are simple to use and feel like build in language features

* Unmatched Test reporting
    * JUnit XML for use with CI/CD tools.
    * HTML Build Summary Report for reporting test suite level information
    * HTML Test Case Detailed report for each test case.
    * HTML based test log files
    * Find and debug issues faster

* Verification component library
    * Free open source verification components for AXI4 Full, AXI4 Lite, AXI Stream, UART, and DPRAM
    * More in progress

* One Script to Run Simulators
    * Same script supports GHDL, Aldec Riviera-PRO and ActiveHDL, Siemens QuestaSim and ModelSim, Synopsys VCS, and Cadence Xcelium

* It is free open source.
    * It upgrades an ordinary VHDL license with full featured verification capabilities.

OSVVM is developed by the same VHDL experts who
have helped develop VHDL standards.
We have used our expert VHDL skills to create
advanced verification capabilities that are easy to use.

SynthWorks has been OSVVM for 25+ years in our
training classes and consulting work.
During that time, we have innovated new capabilities
and evolved our existing ones to increase
re-use and reduce effort and time spent.
