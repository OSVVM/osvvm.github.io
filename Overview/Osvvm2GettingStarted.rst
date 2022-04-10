Getting Started with OSVVM
####################################################


Getting Started with OSVVM
====================================================
The best way to get started with OSVVM is to run the demo examples.

Download OSVVM
----------------------------------------------------
OSVVM is available as either a git repository :gh:`OsvvmLibraries` or
a zip file from `OSVVM Downloads Page <https://osvvm.org/downloads/>`_.

On GitHub, all OSVVM libraries are a submodule of the repository :gh:`OsvvmLibraries`.
Download all OSVVM libraries using git clone with the "--recursive" flag:

.. code-block::

  $ git clone --recursive https://GitHub.com/OSVVM/OsvvmLibraries


Running the Demos
----------------------------------------------------
A great way to get oriented with OSVVM is to run the demos.

If you are using Aldec's Rivera-PRO or Siemen's QuestaSim/ModelSim do the following.

- Step 1:  Create a directory named sim that is in the same
directory that contains the OsvvmLibraries directory.
- Step 2:  Start your simulator and go to the sim directory. 
- Step 3:  Do the following in your simulator command line:

.. code-block::

  source ../OsvvmLibraries/Scripts/StartUp.tcl
  build  ../OsvvmLibraries
  build  ../OsvvmLibraries/RunDemoTests.pro
  
These will produce some reports, such as OsvvmLibraries_RunDemoTests.html.
We will discuss these in the next section, OSVVM Reports.

If you are using GHDL, Aldec Active-HDL, Synopsys VCS, or
Cadence Xcelium, see the OSVVM Script User Guide for details on
running the scripts in these tool.
The start up aspect for each of these is slightly different, however,
once you get the simulator into OSVVM script mode, running the scripts
is the same.
