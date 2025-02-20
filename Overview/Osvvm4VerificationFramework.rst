Structured Testbench Framework 
###################################################

Structured Testbench Framework 
====================================================
Some methodologies (or frameworks) are so complex that you 
need a script to create initial starting 
point for writing verification components, test cases, and/or
the test harness.  
SystemVerilog + UVM is certainly like this. 
There are even several organizations that propose that 
you use their "Lite" or "Easy" approach.

OSVVM is simple enough to use on small blocks and 
powerful enough to use on large, complex chips or systems.  
This allows us to use the same style of 
framework for RTL, Core, and Chip level verification - 
which in turn facilitates re-use of verification 
components and test cases. 
OSVVM has added the abstractions needed to make our 
verification component based approach as easy as 
the "Lite" approach of other methodologies.

SynthWorks has been using this framework for 25+ years in our
training classes and consulting work.
During that time, we have innovated new capabilities
and evolved our existing ones to increase 
re-use and reduce effort spent.

When we examine OSVVM's framework in detail, we see that it 
has many similar elements to SystemVerilog + UVM.  
However, one thing not present is OO language constructs.
Instead OSVVM uses ordinary VHDL constructs, such as structural and
behavioral code.
This makes it readily accessible to both verfication and RTL engineers.


Going Further
----------------------------------------------------
Read the following documents for more information on
OSVVM's Structured Testbench Framework.


.. list-table:: 
    :widths: 40 10  
    :header-rows: 1
    
    * - Document
      - User Guide
    * - OSVVM's Structured Testbench Framework
      - :pdfdoc:`UG <OSVVM_structured_testbench_framework.pdf>`
    * - OSVVM's Verification Component Developer's Guide
      - :pdfdoc:`UG <OSVVM_verification_component_developers_guide.pdf>`
    * - OSVVM's Test Writers User Guide
      - :pdfdoc:`UG <OSVVM_test_writers_user_guide.pdf>`
    * - OSVVM's Address Bus Model Independent Transactions Users Guide
      - :pdfdoc:`UG <Address_Bus_Model_Independent_Transactions_user_guide.pdf>`
    * - OSVVM's Stream Model Independent Transactions Users Guide
      - :pdfdoc:`UG <Stream_Model_Independent_Transactions_user_guide.pdf>`


Related publications and webinars

.. list-table:: 
    :widths: 30 20  
    :header-rows: 1
    
    * - Publications and Webinars
      - Event
    * - `OSVVM Leading Edge Verification for the VHDL Community <https://www.aldec.com/en/support/resources/multimedia/webinars/2186>`_
      - Part 1 of Better FPGA Verification with VHDL, With Aldec May 2022 
    * - `Faster than Lite Verification Component Development with OSVVM <https://www.aldec.com/en/support/resources/multimedia/webinars/2187>`_
      - Part 2 of Better FPGA Verification with VHDL, With Aldec June 2022 
    * - `OSVVM's Test Reports and Simulator Independent Scripting <https://www.aldec.com/en/support/resources/multimedia/webinars/2188>`_
      - Part 3 of Better FPGA Verification with VHDL, With Aldec June 2022 
    * - `Advances in OSVVM's Verification Data Structures <https://www.aldec.com/en/support/resources/multimedia/webinars/2190>`_
      - Part 4 of Better FPGA Verification with VHDL, With Aldec June 2022 
    * - `OSVVM: Leading Edge Verification for the VHDL Community <https://www.youtube.com/watch?v=KVmGDy_PHNI>`_
      - DVClub Europe April 2022 
