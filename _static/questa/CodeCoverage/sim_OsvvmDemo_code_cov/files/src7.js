var g_data = {"name":"C:/SynthWorks/Dev/_osvvm/OsvvmLibraries/AXI4/common/src/Axi4LiteInterfacePkg.vhd","src":"--\n--  File Name:         Axi4LiteInterfacePkg.vhd\n--  Design Unit Name:  Axi4LiteInterfacePkg\n--  Revision:          OSVVM MODELS STANDARD VERSION\n--\n--  Maintainer:        Jim Lewis      email:  jim@synthworks.com\n--  Contributor(s):\n--     Jim Lewis      jim@synthworks.com\n--\n--\n--  Description:\n--      Defines types, constants, and subprograms to support the Axi4Lite interface to DUT\n--      These are currently only intended for testbench models.\n--      When VHDL-2018 intefaces gain popular support, these will be changed to support them. \n--          \n--\n--  Developed by:\n--        SynthWorks Design Inc.\n--        VHDL Training Classes\n--        http://www.SynthWorks.com\n--\n--  Revision History:\n--    Date      Version    Description\n--    03/2022   2022.03    Factored out of Axi4InterfaceCommonPkg\n--    01/2020   2020.01    Updated license notice\n--    09/2017   2017       Initial revision\n--\n--\n--  This file is part of OSVVM.\n--  \n--  Copyright (c) 2017 - 2022 by SynthWorks Design Inc.  \n--  \n--  Licensed under the Apache License, Version 2.0 (the \"License\");\n--  you may not use this file except in compliance with the License.\n--  You may obtain a copy of the License at\n--  \n--      https://www.apache.org/licenses/LICENSE-2.0\n--  \n--  Unless required by applicable law or agreed to in writing, software\n--  distributed under the License is distributed on an \"AS IS\" BASIS,\n--  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n--  See the License for the specific language governing permissions and\n--  limitations under the License.\n--  \n\nlibrary ieee ; \n  use ieee.std_logic_1164.all ;\n  use ieee.numeric_std.all ;\n  use ieee.numeric_std_unsigned.all ;\n  \nuse work.Axi4InterfaceCommonPkg.all ;\n\npackage Axi4LiteInterfacePkg is \n  -- AXI Write Address Channel\n  type Axi4LiteWriteAddressRecType is record\n    Valid     : std_logic ; \n    Ready     : std_logic ; \n    Addr      : std_logic_vector ; \n    Prot      : Axi4ProtType ;\n  end record Axi4LiteWriteAddressRecType ; \n  \n  function InitAxi4LiteWriteAddressRec (AW : Axi4LiteWriteAddressRecType; InitVal : std_logic := 'Z' ) return Axi4LiteWriteAddressRecType ;\n  \n--\n--!TODO Add VHDL-2018 mode declarations here\n-- Comment out for now, also include `ifdef for language revision\n--\n  \n  -- AXI Write Data Channel\n  type Axi4LiteWriteDataRecType is record\n    Valid      : std_logic ; \n    Ready      : std_logic ; \n    Data       : std_logic_vector ; \n    Strb       : std_logic_vector ; \n  end record Axi4LiteWriteDataRecType ; \n  \n  function InitAxi4LiteWriteDataRec (WD : Axi4LiteWriteDataRecType; InitVal : std_logic := 'Z' ) return Axi4LiteWriteDataRecType ;\n\n-- Add VHDL-2018 modes here\n\n  -- AXI Write Response Channel\n  type Axi4LiteWriteResponseRecType is record\n    Valid      : std_logic ; \n    Ready      : std_logic ; \n    Resp       : Axi4RespType ; \n  end record Axi4LiteWriteResponseRecType ; \n  \n  function InitAxi4LiteWriteResponseRec(InitVal : std_logic := 'Z') return Axi4LiteWriteResponseRecType ;\n  \n-- Add VHDL-2018 modes here\n\n  \n  -- AXI Read Address Channel\n  type Axi4LiteReadAddressRecType is record\n    Valid     : std_logic ; \n    Ready     : std_logic ; \n    Addr      : std_logic_vector ; \n    Prot      : Axi4ProtType ; \n  end record Axi4LiteReadAddressRecType ; \n  \n  function InitAxi4LiteReadAddressRec (AR : Axi4LiteReadAddressRecType; InitVal : std_logic := 'Z' ) return Axi4LiteReadAddressRecType ;\n\n-- Add VHDL-2018 modes here\n\n  -- AXI Read Data Channel\n  type Axi4LiteReadDataRecType is record\n    Valid      : std_logic ; \n    Ready      : std_logic ; \n    Data       : std_logic_vector ; \n    Resp       : Axi4RespType ;\n  end record Axi4LiteReadDataRecType ; \n  \n  function InitAxi4LiteReadDataRec (RD : Axi4LiteReadDataRecType; InitVal : std_logic := 'Z' ) return Axi4LiteReadDataRecType ;\n  \n-- Add VHDL-2018 modes here\n  \n  type Axi4LiteRecType is record\n    WriteAddress   : Axi4LiteWriteAddressRecType ; \n    WriteData      : Axi4LiteWriteDataRecType ; \n    WriteResponse  : Axi4LiteWriteResponseRecType ; \n    ReadAddress    : Axi4LiteReadAddressRecType ; \n    ReadData       : Axi4LiteReadDataRecType ; \n  end record Axi4LiteRecType ; \n  \n  function  InitAxi4LiteRec (AxiBusRec : Axi4LiteRecType; InitVal : std_logic := 'Z') return Axi4LiteRecType ;\n  procedure InitAxi4LiteRec (signal AxiBusRec : inout Axi4LiteRecType ) ;\n  \nend package Axi4LiteInterfacePkg ;\npackage body Axi4LiteInterfacePkg is \n\n-- add function bodies here\n  function InitAxi4LiteWriteAddressRec (AW : Axi4LiteWriteAddressRecType; InitVal : std_logic := 'Z' ) return Axi4LiteWriteAddressRecType is\n  begin\n    return (\n      Valid => InitVal, \n      Ready => InitVal, \n      Addr  => (AW.Addr'range  => InitVal), \n      Prot  => (others         => InitVal)\n    ) ;\n  end function InitAxi4LiteWriteAddressRec ; \n\n  function InitAxi4LiteWriteDataRec (WD : Axi4LiteWriteDataRecType; InitVal : std_logic := 'Z' ) return Axi4LiteWriteDataRecType is\n  begin\n    return (\n      Valid  => InitVal,\n      Ready  => InitVal,\n      Data   => (WD.Data'range  => InitVal),  \n      Strb   => (WD.Strb'range  => InitVal) \n    ) ;\n  end function InitAxi4LiteWriteDataRec ; \n\n  function InitAxi4LiteWriteResponseRec(InitVal : std_logic := 'Z') return Axi4LiteWriteResponseRecType is\n  begin\n    return (\n      Valid  => InitVal,\n      Ready  => InitVal,\n      Resp   => (others => InitVal)  \n    ) ;\n  end function InitAxi4LiteWriteResponseRec ; \n\n  function InitAxi4LiteReadAddressRec (AR : Axi4LiteReadAddressRecType; InitVal : std_logic := 'Z' ) return Axi4LiteReadAddressRecType is\n  begin\n    return (\n      Valid => InitVal, \n      Ready => InitVal, \n      Addr  => (AR.Addr'range  => InitVal), \n      Prot  => (others         => InitVal)\n    ) ;\n  end function InitAxi4LiteReadAddressRec ; \n\n  function InitAxi4LiteReadDataRec (RD : Axi4LiteReadDataRecType; InitVal : std_logic := 'Z' ) return Axi4LiteReadDataRecType is\n  begin\n    return (\n      Valid  => InitVal,\n      Ready  => InitVal,\n      Data   => (RD.Data'range  => InitVal),  \n      Resp   => (others         => InitVal)  \n    ) ;\n  end function InitAxi4LiteReadDataRec ; \n    \n  function InitAxi4LiteRec (AxiBusRec : Axi4LiteRecType; InitVal : std_logic := 'Z') return Axi4LiteRecType is\n  begin\n    return ( \n      WriteAddress   => InitAxi4LiteWriteAddressRec( AxiBusRec.WriteAddress,   InitVal),\n      WriteData      => InitAxi4LiteWriteDataRec(    AxiBusRec.WriteData,      InitVal),\n      WriteResponse  => InitAxi4LiteWriteResponseRec(                          InitVal), \n      ReadAddress    => InitAxi4LiteReadAddressRec(  AxiBusRec.ReadAddress,    InitVal),\n      ReadData       => InitAxi4LiteReadDataRec(     AxiBusRec.ReadData,       InitVal)\n    ) ;\n  end function InitAxi4LiteRec ; \n\n\n  procedure InitAxi4LiteRec (signal AxiBusRec : inout Axi4LiteRecType ) is\n  begin\n    AxiBusRec <= InitAxi4LiteRec(AxiBusRec, 'Z') ;\n  end procedure InitAxi4LiteRec ;\n\nend package body Axi4LiteInterfacePkg ; \n\n  \n\n","lang":"vhdl"};
processSrcData(g_data);