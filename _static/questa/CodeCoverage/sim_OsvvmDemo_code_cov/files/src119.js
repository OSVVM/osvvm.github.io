var g_data = {"name":"C:/SynthWorks/Dev/_osvvm/OsvvmLibraries/AXI4/Axi4/testbench_MultipleMemory/TbAxi4_Separate1.vhd","src":"--\n--  File Name:         TbAxi4_Separate1.vhd\n--  Design Unit Name:  Architecture of TestCtrl\n--  Revision:          OSVVM MODELS STANDARD VERSION\n--\n--  Maintainer:        Jim Lewis      email:  jim@synthworks.com\n--  Contributor(s):\n--     Jim Lewis      jim@synthworks.com\n--\n--\n--  Description:\n--      Test transaction source\n--\n--\n--  Developed by:\n--        SynthWorks Design Inc.\n--        VHDL Training Classes\n--        http://www.SynthWorks.com\n--\n--  Revision History:\n--    Date      Version    Description\n--    02/2021   2021.02    Initial revision\n--\n--\n--  This file is part of OSVVM.\n--  \n--  Copyright (c) 2021 by SynthWorks Design Inc.  \n--  \n--  Licensed under the Apache License, Version 2.0 (the \"License\");\n--  you may not use this file except in compliance with the License.\n--  You may obtain a copy of the License at\n--  \n--      https://www.apache.org/licenses/LICENSE-2.0\n--  \n--  Unless required by applicable law or agreed to in writing, software\n--  distributed under the License is distributed on an \"AS IS\" BASIS,\n--  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n--  See the License for the specific language governing permissions and\n--  limitations under the License.\n--  \n\narchitecture Separate1 of TestCtrl is\n\n  signal Sync1, TestDone : integer_barrier := 1 ;\n  signal TbID : AlertLogIDType ; \n\nbegin\n\n  ------------------------------------------------------------\n  -- ControlProc\n  --   Set up AlertLog and wait for end of test\n  ------------------------------------------------------------\n  ControlProc : process\n  begin\n    -- Initialization of test\n    SetTestName(\"TbAxi4_Separate1\") ;\n    SetLogEnable(PASSED, TRUE) ;    -- Enable PASSED logs\n    SetLogEnable(INFO, TRUE) ;    -- Enable INFO logs\n    TbID <= GetAlertLogID(\"Testbench\") ;\n\n    -- Wait for testbench initialization \n    wait for 0 ns ;  wait for 0 ns ;\n    TranscriptOpen(OSVVM_RESULTS_DIR & \"TbAxi4_Separate1.txt\") ;\n    SetTranscriptMirror(TRUE) ; \n\n    -- Wait for Design Reset\n    wait until nReset = '1' ;  \n    ClearAlerts ;\n\n    -- Wait for test to finish\n    WaitForBarrier(TestDone, 35 ms) ;\n    AlertIf(now >= 35 ms, \"Test finished due to timeout\") ;\n    AlertIf(GetAffirmCount < 1, \"Test is not Self-Checking\");\n    \n    \n    TranscriptClose ; \n    -- Printing differs in different simulators due to differences in process order execution\n    -- AlertIfDiff(OSVVM_RESULTS_DIR & \"TbAxi4_Separate1.txt\", \"../AXI4/Axi4/testbench/validated_results/TbAxi4_Separate1.txt\", \"\") ; \n\n    EndOfTestReports(ExternalErrors => (0, -12, 0)) ; \n    std.env.stop ; \n    wait ; \n  end process ControlProc ; \n\n  ------------------------------------------------------------\n  -- ManagerProc1\n  --   Generate transactions for AxiManager\n  ------------------------------------------------------------\n  ManagerProc1 : process\n    variable StartTime : time ; \n    variable IntOption  : integer ; \n    variable BoolOption : boolean ; \n  begin\n    wait until nReset = '1' ;  \n    -- First Alignment to clock\n    WaitForClock(Manager1Rec, 1) ; \n\n    Write(Manager1Rec, X\"1000_1000\", X\"5555_5555\" ) ;\n    ReadCheck(Manager1Rec, X\"1000_1000\", X\"5555_5555\" ) ;\n    \n    PushBurstIncrement(WriteBurstFifo1, 3, 6, AXI_DATA_WIDTH) ;\n    WriteBurst(Manager1Rec, X\"0000_0008\", 6) ;\n    \n    ReadBurst (Manager1Rec, X\"0000_0008\", 6) ;\n    CheckBurstIncrement(ReadBurstFifo1, 3, 6, AXI_DATA_WIDTH) ;\n\n    WaitForBarrier(Sync1) ;\n    WaitForBarrier(Sync1) ;\n\n    -- Check values written by Manager2 side\n    ReadCheck(Manager1Rec, X\"1000_2000\", X\"AAAA_AAAA\" ) ;\n\n    ReadBurst (Manager1Rec, X\"0000_1008\", 4) ;\n    CheckBurstIncrement(ReadBurstFifo1, 10, 4, AXI_DATA_WIDTH) ;\n\n    WaitForBarrier(TestDone) ;\n    wait ;\n  end process ManagerProc1 ;\n  \n  ------------------------------------------------------------\n  -- ManagerProc2\n  --   Generate transactions for AxiManager\n  ------------------------------------------------------------\n  ManagerProc2 : process\n    variable StartTime : time ; \n    variable IntOption  : integer ; \n    variable BoolOption : boolean ; \n  begin\n    WaitForBarrier(Sync1) ;\n\n    WaitForClock(Manager2Rec, 1) ; \n    \n    -- Check values written by other side\n    ReadCheck(Manager2Rec, X\"1000_1000\", X\"5555_5555\" ) ;\n    \n    ReadBurst (Manager2Rec, X\"0000_0008\", 6) ;\n    CheckBurstIncrement(ReadBurstFifo2, 3, 6, AXI_DATA_WIDTH) ;\n\n\n    Write(Manager2Rec, X\"1000_2000\", X\"AAAA_AAAA\" ) ;\n    ReadCheck(Manager2Rec, X\"1000_2000\", X\"AAAA_AAAA\" ) ;\n    PushBurstIncrement(WriteBurstFifo2, 10, 4, AXI_DATA_WIDTH) ;\n    WriteBurst(Manager2Rec, X\"0000_1008\", 4) ;\n    ReadBurst (Manager2Rec, X\"0000_1008\", 4) ;\n    CheckBurstIncrement(ReadBurstFifo2, 10, 4, AXI_DATA_WIDTH) ;\n    \n    WaitForBarrier(Sync1) ;\n\n    -- Wait for outputs to propagate and signal TestDone\n    WaitForClock(Manager2Rec, 2) ;\n    WaitForBarrier(TestDone) ;\n    wait ;\n  end process ManagerProc2 ;\n\n  ------------------------------------------------------------\n  -- SubordinateProc\n  --   Generate transactions for AxiSubordinate\n  ------------------------------------------------------------\n  SubordinateProc : process\n  begin\n    WaitForBarrier(TestDone) ;\n    wait ;\n  end process SubordinateProc ;\n\n\nend Separate1 ;\n\nlibrary OSVVM_AXI4 ;\n\nConfiguration TbAxi4_Separate1 of TbAxi4_MultipleMemory is\n  for TestHarness\n    for TestCtrl_1 : TestCtrl\n      use entity work.TestCtrl(Separate1) ; \n    end for ; \n    \n-- ##    for all : Axi4Memory\n-- ##      use entity OSVVM_AXI4.Axi4Memory(MemorySubordinate) \n-- ##          generic map (MEMORY_NAME => \"SharedMemory\");\n-- ##    end for ; \n\n  end for ; \nend TbAxi4_Separate1 ; ","lang":"vhdl"};
processSrcData(g_data);