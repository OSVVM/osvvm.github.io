Scripting Library
###################################################

Scripting Library
====================================================
The goal of OSVVM's scripting is to have 
"One Script to Run them All" - where all is any simulator.

Currently supported simulators are:
* GHDL (Free Open Source simulator),
* Aldec's Active-HDL and Riviera-PRO, 
* Siemen's ModelSim and QuestaSim, 
* Synopsys' VCS, and
* Cadence's Xcelium.

OSVVM scripts are a TCL based API layer that provides a 
tool independent means to simulate (and perhaps in the 
future synthesize) your design. 
The API uses TCL procedures to create the abstraction 
layers – which is why they have the extension .pro. 

The scripts are executable TCL, so the full power of TCL 
can be used when needed (such as is in osvvm.pro).

Going Further
----------------------------------------------------
Read the following documents for more information on
OSVVM's Scripting.

.. list-table:: 
    :widths: 40 10  

    * - OSVVM Script User Guide
      - :pdfdoc:`UG pdf <Script_user_guide.pdf>`
    * - OSVVM Script library  
      - :gh:`Git Repository <OSVVM-Scripts>`
