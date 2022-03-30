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
Prior to starting the OSVVM scripting environment, at the same
level of the OsvvmLibraries directory, create a directory
named sim.
Start your simulator and go to the sim directory.
Once there, for Aldec Riviera-PRO or Siemen's QuestaSim/ModelSim
do the following in your simulator.

.. code-block::

  source ../OsvvmLibraries/Scripts/StartUp.tcl
  build  ../OsvvmLibraries
  build  ../OsvvmLibraries/RunDemoTests.pro

If you are running GHDL, Aldec Active-HDL, Synopsys VCS, or
Cadence Xcelium, see the OSVVM Script User Guide for details on
running the scripts in these tool.
The start up aspect for each of these is slightly different, however,
once you get the simulator into OSVVM script mode, running the scripts
is the same.
