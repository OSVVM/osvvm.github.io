var g_data = {"name":"C:/SynthWorks/Dev/_osvvm/OsvvmLibraries/AXI4/Axi4/testbench/TbAxi4.vhd","src":"--\n--  File Name:         TbAxi4.vhd\n--  Design Unit Name:  TbAxi4\n--  Revision:          OSVVM MODELS STANDARD VERSION\n--\n--  Maintainer:        Jim Lewis      email:  jim@synthworks.com\n--  Contributor(s):\n--     Jim Lewis      jim@synthworks.com\n--\n--\n--  Description:\n--      Simple AXI Lite Manager Model\n--\n--\n--  Developed by:\n--        SynthWorks Design Inc.\n--        VHDL Training Classes\n--        http://www.SynthWorks.com\n--\n--  Revision History:\n--    Date      Version    Description\n--    04/2018   2018       Initial revision\n--    01/2020   2020.01    Updated license notice\n--    12/2020   2020.12    Updated signal and port names\n--\n--\n--  This file is part of OSVVM.\n--\n--  Copyright (c) 2018 - 2020 by SynthWorks Design Inc.\n--\n--  Licensed under the Apache License, Version 2.0 (the \"License\");\n--  you may not use this file except in compliance with the License.\n--  You may obtain a copy of the License at\n--\n--      https://www.apache.org/licenses/LICENSE-2.0\n--\n--  Unless required by applicable law or agreed to in writing, software\n--  distributed under the License is distributed on an \"AS IS\" BASIS,\n--  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n--  See the License for the specific language governing permissions and\n--  limitations under the License.\n--\n\nlibrary ieee ;\n  use ieee.std_logic_1164.all ;\n  use ieee.numeric_std.all ;\n  use ieee.numeric_std_unsigned.all ;\n\nlibrary osvvm ;\n  context osvvm.OsvvmContext ;\n\nlibrary OSVVM_AXI4 ;\n  context OSVVM_AXI4.Axi4Context ;\n\nentity TbAxi4 is\nend entity TbAxi4 ;\narchitecture TestHarness of TbAxi4 is\n  constant AXI_ADDR_WIDTH : integer := 32 ;\n  constant AXI_DATA_WIDTH : integer := 32 ;\n  constant AXI_STRB_WIDTH : integer := AXI_DATA_WIDTH/8 ;\n\n\n  constant tperiod_Clk : time := 10 ns ;\n  constant tpd         : time := 2 ns ;\n\n  signal Clk         : std_logic ;\n  signal nReset      : std_logic ;\n\n--  -- Testbench Transaction Interface\n--  subtype LocalTransactionRecType is AddressBusRecType(\n--    Address(AXI_ADDR_WIDTH-1 downto 0),\n--    DataToModel(AXI_DATA_WIDTH-1 downto 0),\n--    DataFromModel(AXI_DATA_WIDTH-1 downto 0)\n--  ) ;\n--  signal ManagerRec   : LocalTransactionRecType ;\n--  signal SubordinateRec  : LocalTransactionRecType ;\n  signal ManagerRec, SubordinateRec  : AddressBusRecType (\n          Address(AXI_ADDR_WIDTH-1 downto 0),\n          DataToModel(AXI_DATA_WIDTH-1 downto 0),\n          DataFromModel(AXI_DATA_WIDTH-1 downto 0)\n        ) ;\n\n--  -- AXI Manager Functional Interface\n--  signal   AxiBus : Axi4RecType(\n--    WriteAddress( AWAddr(AXI_ADDR_WIDTH-1 downto 0) ),\n--    WriteData   ( WData (AXI_DATA_WIDTH-1 downto 0),   WStrb(AXI_STRB_WIDTH-1 downto 0) ),\n--    ReadAddress ( ARAddr(AXI_ADDR_WIDTH-1 downto 0) ),\n--    ReadData    ( RData (AXI_DATA_WIDTH-1 downto 0) )\n--  ) ;\n\n  signal   AxiBus : Axi4RecType(\n    WriteAddress(\n      Addr(AXI_ADDR_WIDTH-1 downto 0),\n      ID(7 downto 0),\n      User(7 downto 0)\n    ),\n    WriteData   (\n      Data(AXI_DATA_WIDTH-1 downto 0),\n      Strb(AXI_STRB_WIDTH-1 downto 0),\n      User(7 downto 0),\n      ID(7 downto 0)\n    ),\n    WriteResponse(\n      ID(7 downto 0),\n      User(7 downto 0)\n    ),\n    ReadAddress (\n      Addr(AXI_ADDR_WIDTH-1 downto 0),\n      ID(7 downto 0),\n      User(7 downto 0)\n    ),\n    ReadData    (\n      Data(AXI_DATA_WIDTH-1 downto 0),\n      ID(7 downto 0),\n      User(7 downto 0)\n    )\n  ) ;\n\n\n  component TestCtrl is\n    port (\n      -- Global Signal Interface\n      nReset         : In    std_logic ;\n\n      -- Transaction Interfaces\n      ManagerRec      : inout AddressBusRecType ;\n      SubordinateRec   : inout AddressBusRecType\n    ) ;\n  end component TestCtrl ;\n\n\nbegin\n\n  -- create Clock\n  Osvvm.TbUtilPkg.CreateClock (\n    Clk        => Clk,\n    Period     => Tperiod_Clk\n  )  ;\n\n  -- create nReset\n  Osvvm.TbUtilPkg.CreateReset (\n    Reset       => nReset,\n    ResetActive => '0',\n    Clk         => Clk,\n    Period      => 7 * tperiod_Clk,\n    tpd         => tpd\n  ) ;\n\n  -- Behavioral model.  Replaces DUT for labs\n  Subordinate_1 : Axi4Subordinate\n  port map (\n    -- Globals\n    Clk         => Clk,\n    nReset      => nReset,\n\n    -- AXI Manager Functional Interface\n    AxiBus  => AxiBus,\n\n    -- Testbench Transaction Interface\n    TransRec    => SubordinateRec\n  ) ;\n\n  Manager_1 : Axi4Manager\n  port map (\n    -- Globals\n    Clk         => Clk,\n    nReset      => nReset,\n\n    -- AXI Manager Functional Interface\n    AxiBus      => AxiBus,\n\n    -- Testbench Transaction Interface\n    TransRec    => ManagerRec\n  ) ;\n\n\n  Monitor_1 : Axi4Monitor\n  port map (\n    -- Globals\n    Clk         => Clk,\n    nReset      => nReset,\n\n    -- AXI Manager Functional Interface\n    AxiBus      => AxiBus\n  ) ;\n\n\n  TestCtrl_1 : TestCtrl\n  port map (\n    -- Global Signal Interface\n    nReset        => nReset,\n\n    -- Transaction Interfaces\n    ManagerRec     => ManagerRec,\n    SubordinateRec  => SubordinateRec\n  ) ;\n\nend architecture TestHarness ;","lang":"vhdl"};
processSrcData(g_data);