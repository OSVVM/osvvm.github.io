VHDL Utility Library
###################################################

VHDL Utility Library
====================================================

The :gh:`OSVVM Utility Library <osvvm>` implements the advanced verification
capabilities found in other verification languages (such as 
SystemVerilog and UVM) as packages.  The list below lists
out many of the OSVVM features and the package in which they are 
implemented.

* Constrained Random test generation (RandomPkg)
* Functional Coverage with hooks for UCIS coverage database integration (CoveragePkg)
* Intelligent Coverage Random test generation  (CoveragePkg)
* Utilities for testbench process synchronization generation (TbUtilPkg)
* Utilities for clock and reset generation (TbUtilPkg)
* Transcript files (TranscriptPkg)
* Error logging and reporting - Alerts and Affirmations (AlertLogPkg)
* Message filtering - Logs (AlertLogPkg)
* Scoreboards and FIFOs (data structures for verification) (ScoreboardGenericPkg)
* HTML and JUnit XML test reporting (ReportPkg, AlertLogPkg, CoveragePkg, ScoreboardGenericPkg)
* Memory models (MemoryPkg)
* Transaction-Level Modeling Support (TbUtilPkg, ResolutionPkg)

Through the years, the packages have been updated many times.
Now, all of the packages that create data structures
(AlertLogPkg, CoveragePkg, ScoreboardGenericPkg, and MemoryPkg) 
use singleton data structures.
Usage of singletons simplifies API to an ordinary 
call interface - ie: no more shared variables and 
protected types.


Going Further
----------------------------------------------------
Read the following documents for more information on
OSVVM's VHDL Utility Library.

.. list-table:: 
    :widths: 40 10 10 
    :header-rows: 1
    
    * - Document
      - User Guide
      - Quick Reference
    * - OSVVM Test Writer's User Guide - a general overview to usage
      - :pdfdoc:`UG <OSVVM_test_writers_user_guide.pdf>`
      - None
    * - AlertLogPkg
      - :pdfdoc:`UG <AlertLogPkg_user_guide.pdf>`
      - :pdfdoc:`QR <AlertlogPkg_quickref.pdf>`
    * - TranscriptPkg
      - :pdfdoc:`UG <TranscriptPkg_user_guide.pdf>`
      - :pdfdoc:`QR <TranscriptPkg_quickref.pdf>`
    * - RandomPkg
      - :pdfdoc:`UG <RandomPkg_user_guide.pdf>`
      - :pdfdoc:`QR <RandomPkg_quickref.pdf>`
    * - CoveragePkg
      - :pdfdoc:`UG <CoveragePkg_user_guide.pdf>`
      - :pdfdoc:`QR <CoveragePkg_quickref.pdf>`
    * - ScoreboardGenericPkg
      - :pdfdoc:`UG <ScoreboardPkg_user_guide.pdf>`
      - :pdfdoc:`QR <Scoreboard_QuickRef.pdf>`
    * - TbUtilPkg
      - :pdfdoc:`UG <TbUtilPkg_user_guide.pdf>`
      - :pdfdoc:`QR <TbUtilPkg_quickref.pdf>`
    * - MemoryPkg
      - :pdfdoc:`UG <MemoryPkg_user_guide.pdf>`
      - None
    * - TextUtilPkg
      - :pdfdoc:`UG <TextUtilPkg_user_guide.pdf>`
      - None

Related publications and webinars

.. list-table:: 
    :widths: 20 30  
    :header-rows: 1
    
    * - Publications and Webinars
    * - Series: Better FPGA Verification with VHDL, With Aldec May - June 2022 
    * - `Part1:  OSVVM Leading Edge Verification for the VHDL Community <https://www.aldec.com/en/support/resources/multimedia/webinars/2186>`_
    *  - Part 2: Faster than Lite Verification Component Development with OSVVM <https://www.aldec.com/en/support/resources/multimedia/webinars/2187>`_
    * - Part 3: OSVVM's Test Reports and Simulator Independent Scripting <https://www.aldec.com/en/support/resources/multimedia/webinars/2188>`_
    * - Part 4: Advances in OSVVM's Verification Data Structures
       <https://www.aldec.com/en/support/resources/multimedia/webinars/2190>`_
    * - DVClub Europe April 2022 
    * - `OSVVM: Leading Edge Verification for the VHDL Community <https://www.youtube.com/watch?v=KVmGDy_PHNI>`_

