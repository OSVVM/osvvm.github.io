var g_data = {"name":"C:/SynthWorks/Dev/_osvvm/OsvvmLibraries/osvvm/MessageListPkg.vhd","src":"--\n--  File Name:         MessageListPkg.vhd\n--  Design Unit Name:  MessageListPkg\n--  Revision:          STANDARD VERSION\n--\n--  Maintainer:        Jim Lewis      email:  jim@synthworks.com\n--  Contributor(s):\n--     Jim Lewis          SynthWorks\n--\n--\n--  Package Defines\n--      Data structure for multi-line message\n--\n--  Developed for:\n--        SynthWorks Design Inc.\n--        VHDL Training Classes\n--        11898 SW 128th Ave.  Tigard, Or  97223\n--        http://www.SynthWorks.com\n--\n--  Revision History:\n--    Date      Version    Description\n--    07/2021   2021.07    Initial revision.  \n--                         Written as a replacement for protected types (MessagePkg)\n--                         to simplify usage in new data structure. \n--\n--  This file is part of OSVVM.\n--  \n--  Copyright (c) 2021 by SynthWorks Design Inc.  \n--  \n--  Licensed under the Apache License, Version 2.0 (the \"License\");\n--  you may not use this file except in compliance with the License.\n--  You may obtain a copy of the License at\n--  \n--      https://www.apache.org/licenses/LICENSE-2.0\n--  \n--  Unless required by applicable law or agreed to in writing, software\n--  distributed under the License is distributed on an \"AS IS\" BASIS,\n--  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n--  See the License for the specific language governing permissions and\n--  limitations under the License.\n--  \n\nlibrary ieee ;\nuse std.textio.all ;\n\npackage MessageListPkg is\n  type MessageStructType ; \n  type MessageStructPtrType is access MessageStructType ; \n  type MessageStructType is record\n    Name    : line ; \n    NextPtr : MessageStructPtrType ; \n  end record MessageStructType ; \n  \n  procedure SetMessage        (variable Message : inout MessageStructPtrType; Name : String) ;\n  procedure WriteMessage      (variable buf : inout line; variable Message : inout MessageStructPtrType; prefix : string := \"\") ; \n  procedure WriteMessage      (file f : text; variable Message : inout MessageStructPtrType; prefix : string := \"\") ; \n  procedure GetMessageCount   (variable Message : inout MessageStructPtrType; variable Count : out integer) ;\n  procedure DeallocateMessage (variable Message : inout MessageStructPtrType) ; \n\nend package MessageListPkg ;\n\n--- ///////////////////////////////////////////////////////////////////////////\n--- ///////////////////////////////////////////////////////////////////////////\n--- ///////////////////////////////////////////////////////////////////////////\n\npackage body MessageListPkg is\n\n  ------------------------------------------------------------\n  procedure SetMessage (variable Message : inout MessageStructPtrType; Name : String) is\n  ------------------------------------------------------------\n    variable M : MessageStructPtrType ; \n  begin\n    if Message = NULL then\n      Message         := new MessageStructType ; \n      Message.Name    := new string'(Name) ; \n      Message.NextPtr := NULL ;\n    else\n      M := Message ; \n      while M.NextPtr /= NULL loop\n        M := M.NextPtr ; \n      end loop ; \n      M.NextPtr := new MessageStructType ; \n      M         := M.NextPtr ; \n      M.Name    := new string'(Name) ; \n      M.NextPtr := NULL ;\n    end if ; \n  end procedure SetMessage ; \n\n  ------------------------------------------------------------\n  procedure WriteMessage (variable buf : inout line;  variable Message : inout MessageStructPtrType; prefix : string := \"\") is \n  ------------------------------------------------------------\n    variable M : MessageStructPtrType ; \n  begin\n    M := Message ; \n    while M /= NULL loop\n      write(buf, prefix & M.Name.all & LF) ;      \n      M := M.NextPtr ; \n    end loop ;\n  end procedure WriteMessage ;\n\n  ------------------------------------------------------------\n  procedure WriteMessage (file f : text; variable Message : inout MessageStructPtrType; prefix : string := \"\") is \n  ------------------------------------------------------------\n    variable M : MessageStructPtrType ; \n    variable buf : line ; \n  begin\n    M := Message ; \n    while M /= NULL loop\n      write(buf, prefix & M.Name.all) ;\n      writeline(f, buf) ;\n      M := M.NextPtr ; \n    end loop ;\n  end procedure WriteMessage ;\n\n  ------------------------------------------------------------\n  procedure GetMessageCount (variable Message : inout MessageStructPtrType; variable Count : out integer) is\n  ------------------------------------------------------------\n    variable M : MessageStructPtrType ; \n  begin\n    Count := 0 ; \n    M := Message ; \n    while M /= NULL loop\n      Count := Count + 1 ; \n      M := M.NextPtr ; \n    end loop ;\n  end procedure GetMessageCount ;\n\n  ------------------------------------------------------------\n  procedure DeallocateMessage (variable Message : inout MessageStructPtrType) is \n  ------------------------------------------------------------\n    variable OldM : MessageStructPtrType ; \n  begin\n    while Message /= NULL loop\n      OldM := Message ; \n      Message := Message.NextPtr ; \n      deallocate(OldM) ;\n    end loop ;\n  end procedure DeallocateMessage ;\n\nend package body MessageListPkg ;","lang":"vhdl"};
processSrcData(g_data);