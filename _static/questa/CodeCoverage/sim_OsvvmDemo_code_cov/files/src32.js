var g_data = {"name":"C:/SynthWorks/Dev/_osvvm/OsvvmLibraries/osvvm/TextUtilPkg.vhd","src":"--\n--  File Name:         TextUtilPkg.vhd\n--  Design Unit Name:  TextUtilPkg\n--  Revision:          STANDARD VERSION\n--\n--  Maintainer:        Jim Lewis      email:  jim@synthworks.com\n--  Contributor(s):\n--     Jim Lewis      jim@synthworks.com\n--\n--\n--  Description:\n--        Shared Utilities for handling text files\n--          \n--\n--  Developed for:\n--        SynthWorks Design Inc.\n--        VHDL Training Classes\n--        11898 SW 128th Ave.  Tigard, Or  97223\n--        http://www.SynthWorks.com\n--\n--  Revision History:\n--    Date      Version    Description\n--    08/2022   2022.08    Added IsHexOrStdLogic.  Updated ReadHexToken to support reading \"UWLH-\"\n--    02/2022   2022.02    Updated to_hxstring to print U, X, Z, W, - when there are 4 in a row and ? for mixed meta\n--                         Added Justify that aligns LEFT, RIGHT, and CENTER with parameters in a sensible order.\n--    01/2022   2022.01    Added to_hxstring - based on hxwrite (in TbUtilPkg prior to release)\n--    08/2020   2020.08    Added ReadUntilDelimiterOrEOL and FindDelimiter\n--    01/2020   2020.01    Updated Licenses to Apache\n--    11/2016   2016.11    Added IsUpper, IsLower, to_upper, to_lower\n--    01/2016   2016.01    Update for L.all(L'left)\n--    01/2015   2015.05    Initial revision\n--\n--\n--  This file is part of OSVVM.\n--  \n--  Copyright (c) 2015 - 2020 by SynthWorks Design Inc.  \n--  \n--  Licensed under the Apache License, Version 2.0 (the \"License\");\n--  you may not use this file except in compliance with the License.\n--  You may obtain a copy of the License at\n--  \n--      https://www.apache.org/licenses/LICENSE-2.0\n--  \n--  Unless required by applicable law or agreed to in writing, software\n--  distributed under the License is distributed on an \"AS IS\" BASIS,\n--  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n--  See the License for the specific language governing permissions and\n--  limitations under the License.\n--  \n\nuse std.textio.all ;\nlibrary ieee ; \nuse ieee.std_logic_1164.all ; \nuse ieee.numeric_std.all ; \n\npackage TextUtilPkg is\n  ------------------------------------------------------------\n  function IsUpper (constant Char : character ) return boolean ;\n  function IsLower (constant Char : character ) return boolean ;\n  function to_lower (constant Char : character ) return character ;\n  function to_lower (constant Str : string ) return string ;\n  function to_upper (constant Char : character ) return character ;\n  function to_upper (constant Str : string ) return string ;\n  function IsHex (constant Char : character ) return boolean ; \n  function IsHexOrStdLogic (constant Char : character ) return boolean ;\n  function IsNumber (constant Char : character ) return boolean ; \n  function IsNumber (Name : string ) return boolean ; \n\n  function isstd_logic (constant Char : character ) return boolean ;\n  \n  -- Crutch until VHDL-2019 conditional initialization\n  function IfElse(Expr : boolean ; A, B : string) return string ; \n\n  ------------------------------------------------------------\n  procedure SkipWhiteSpace (\n  ------------------------------------------------------------\n    variable L     : InOut line ;\n    variable Empty : out   boolean\n  ) ;\n  procedure SkipWhiteSpace (variable L : InOut line) ;\n  \n  ------------------------------------------------------------\n  procedure EmptyOrCommentLine (\n  ------------------------------------------------------------\n    variable L                : InOut  line ;\n    variable Empty            : InOut  boolean ;\n    variable MultiLineComment : inout  boolean \n  ) ;\n  \n  ------------------------------------------------------------\n  procedure ReadUntilDelimiterOrEOL(\n  ------------------------------------------------------------\n    variable L         : InOut line ; \n    variable Name      : InOut line ; \n    constant Delimiter : In    character ;\n    variable ReadValid : Out   boolean \n  ) ;\n\n  ------------------------------------------------------------\n  procedure FindDelimiter(\n  ------------------------------------------------------------\n    variable L                : InOut line ; \n    constant Delimiter        : In    character ;\n    variable Found            : Out   boolean \n  ) ;\n\n  ------------------------------------------------------------\n  procedure ReadHexToken (\n  -- Reads Upto Result'length values, less is ok.\n  -- Does not skip white space\n  ------------------------------------------------------------\n    variable L      : InOut line ;\n    variable Result : Out   std_logic_vector ;\n    variable StrLen : Out   integer \n  ) ; \n    \n  ------------------------------------------------------------\n  procedure ReadBinaryToken (\n  -- Reads Upto Result'length values, less is ok.\n  -- Does not skip white space\n  ------------------------------------------------------------\n    variable L      : InOut line ;\n    variable Result : Out   std_logic_vector ;\n    variable StrLen : Out   integer \n  ) ;   \n\n  ------------------------------------------------------------\n  -- to_hxstring\n  --   print in hex.  If string contains X, then also print in binary\n  ------------------------------------------------------------\n  function to_hxstring ( A : std_ulogic_vector) return string ;\n  function to_hxstring ( A : unsigned) return string ;\n  function to_hxstring ( A : signed) return string ; \n  \n  ------------------------------------------------------------\n  -- Justify\n  --   w/ Fill Character\n  --   w/o Fill character, Parameter order & names sensible\n  ------------------------------------------------------------\n  type AlignType is (RIGHT, LEFT, CENTER) ;\n  \n  function Justify (\n    S       : string ;\n    Amount  : natural ;\n    Align   : AlignType := LEFT\n  ) return string ;  \n\n  function Justify (\n    S       : string ;\n    Fill    : character ;\n    Amount  : natural ;\n    Align   : AlignType := LEFT\n  ) return string ;\n\n  ------------------------------------------------------------\n  -- FileExists\n  --    Return TRUE if file exists\n  ------------------------------------------------------------\n  impure function FileExists(FileName : string) return boolean ; \n\n\nend TextUtilPkg ;\n  \n--- ///////////////////////////////////////////////////////////////////////////\n--- ///////////////////////////////////////////////////////////////////////////\n--- ///////////////////////////////////////////////////////////////////////////\n\npackage body TextUtilPkg is\n  type stdulogic_indexby_stdulogic is array (std_ulogic) of std_ulogic;\n\n  constant LOWER_TO_UPPER_OFFSET : integer := character'POS('a') - character'POS('A') ;\n  \n  ------------------------------------------------------------\n  function \"-\" (R : character ; L : integer ) return character is\n  ------------------------------------------------------------\n  begin\n    return character'VAL(character'pos(R) - L) ;  \n  end function \"-\" ; \n  \n  ------------------------------------------------------------\n  function \"+\" (R : character ; L : integer ) return character is\n  ------------------------------------------------------------\n  begin\n    return character'VAL(character'pos(R) + L) ;  \n  end function \"+\" ; \n\n  ------------------------------------------------------------\n  function IsUpper (constant Char : character ) return boolean is\n  ------------------------------------------------------------\n  begin\n    if Char >= 'A' and Char <= 'Z' then \n      return TRUE ; \n    else\n      return FALSE ; \n    end if ; \n  end function IsUpper ; \n  \n  ------------------------------------------------------------\n  function IsLower (constant Char : character ) return boolean is\n  ------------------------------------------------------------\n  begin\n    if Char >= 'a' and Char <= 'z' then \n      return TRUE ; \n    else\n      return FALSE ; \n    end if ; \n  end function IsLower ;\n \n  ------------------------------------------------------------\n  function to_lower (constant Char : character ) return character is\n  ------------------------------------------------------------\n  begin\n    if IsUpper(Char) then \n      return Char + LOWER_TO_UPPER_OFFSET ; \n    else\n      return Char ; \n    end if ; \n  end function to_lower ;\n\n  ------------------------------------------------------------\n  function to_lower (constant Str : string ) return string is\n  ------------------------------------------------------------\n    variable result : string(Str'range) ;\n  begin\n    for i in Str'range loop \n      result(i) := to_lower(Str(i)) ;\n    end loop ;\n    return result ; \n  end function to_lower ;\n\n  ------------------------------------------------------------\n  function to_upper (constant Char : character ) return character is\n  ------------------------------------------------------------\n  begin\n    if IsLower(Char) then \n      return Char - LOWER_TO_UPPER_OFFSET ; \n    else\n      return Char ; \n    end if ; \n  end function to_upper ;\n\n  ------------------------------------------------------------\n  function to_upper (constant Str : string ) return string is\n  ------------------------------------------------------------\n    variable result : string(Str'range) ;\n  begin\n    for i in Str'range loop \n      result(i) := to_upper(Str(i)) ;\n    end loop ;\n    return result ; \n  end function to_upper ;\n\n  ------------------------------------------------------------\n  function IsHex (constant Char : character ) return boolean is\n  ------------------------------------------------------------\n  begin\n    case Char is \n      when '0' to '9' =>   return TRUE ; \n      when 'a' to 'f' =>   return TRUE ;\n      when 'A' to 'F' =>   return TRUE ;\n      when others     =>   return FALSE ;\n    end case ; \n  end function IsHex ; \n\n  ------------------------------------------------------------\n  function IsHexOrStdLogic (constant Char : character ) return boolean is\n  ------------------------------------------------------------\n  begin\n    case Char is \n      when '0' to '9' =>   return TRUE ; \n      when 'a' to 'f' =>   return TRUE ;\n      when 'A' to 'F' =>   return TRUE ;\n      when 'U' | 'X' | 'Z' | 'W' | 'L' | 'H' | '-' => return TRUE ; \n      when others     =>   return FALSE ;\n    end case ; \n  end function IsHexOrStdLogic ; \n  \n  ------------------------------------------------------------\n  function IsNumber (constant Char : character ) return boolean is \n  ------------------------------------------------------------\n  begin\n    return Char >= '0' and Char <= '9' ;\n  end function IsNumber ; \n  \n  ------------------------------------------------------------\n  function IsNumber (Name : string ) return boolean is\n  ------------------------------------------------------------\n  begin\n    for i in Name'range loop \n      if not IsNumber(Name(i)) then \n        return FALSE ; \n      end if ; \n    end loop ; \n    return TRUE ; \n  end function IsNumber ; \n\n  ------------------------------------------------------------\n  function isstd_logic (constant Char : character ) return boolean is\n  ------------------------------------------------------------\n  begin\n    case Char is\n      when 'U' | 'X' | '0' | '1' | 'Z' | 'W' | 'L' | 'H' | '-' => \n        return TRUE ; \n      when others =>\n        return FALSE ; \n    end case ; \n  end function isstd_logic ;\n  \n  ------------------------------------------------------------\n  function IfElse(Expr : boolean ; A, B : string) return string is \n  ------------------------------------------------------------\n  begin\n    if Expr then \n      return A ; \n    else\n      return B ; \n    end if ; \n  end function IfElse ; \n  \n--  ------------------------------------------------------------\n--  function iscomment (constant Char : character ) return boolean is\n--  ------------------------------------------------------------\n--  begin\n--    case Char is\n--      when '#' | '/' | '-'  => \n--        return TRUE ; \n--      when others =>\n--        return FALSE ; \n--    end case ; \n--  end function iscomment ;\n\n  ------------------------------------------------------------\n  procedure SkipWhiteSpace (\n  ------------------------------------------------------------\n    variable L     : InOut line ;\n    variable Empty : out   boolean\n  ) is\n    variable Valid : boolean ;\n    variable Char  : character ;\n    constant NBSP  : CHARACTER := CHARACTER'val(160);  -- space character\n  begin\n    Empty := TRUE ; \n    WhiteSpLoop : while L /= null and L.all'length > 0 loop\n      if (L.all(L'left) = ' ' or L.all(L'left) = NBSP or L.all(L'left) = HT) then\n        read (L, Char, Valid) ;\n        exit when not Valid ; \n      else\n        Empty := FALSE ; \n        return ;\n      end if ; \n    end loop WhiteSpLoop ;\n  end procedure SkipWhiteSpace ;\n\n  ------------------------------------------------------------\n  procedure SkipWhiteSpace (\n  ------------------------------------------------------------\n    variable L     : InOut line \n  ) is\n    variable Empty : boolean ;\n  begin\n    SkipWhiteSpace(L, Empty) ; \n  end procedure SkipWhiteSpace ;\n  \n  ------------------------------------------------------------\n  -- Package Local \n  procedure FindCommentEnd (\n  ------------------------------------------------------------\n    variable L     : InOut line ;\n    variable Empty : out   boolean ;\n    variable MultiLineComment : inout boolean \n  ) is\n    variable Valid : boolean ;\n    variable Char  : character ;\n  begin\n    MultiLineComment := TRUE ; \n    Empty            := TRUE ; \n    FindEndOfCommentLoop : while L /= null and L.all'length > 1 loop\n      read(L, Char, Valid) ; \n      if Char = '*' and L.all(L'left) = '/' then\n        read(L, Char, Valid) ; \n        Empty            := FALSE ;\n        MultiLineComment := FALSE ;\n        exit FindEndOfCommentLoop ;\n      end if ; \n    end loop ; \n  end procedure FindCommentEnd ;\n  \n  ------------------------------------------------------------\n  procedure EmptyOrCommentLine (\n  ------------------------------------------------------------\n    variable L                : InOut  line ;\n    variable Empty            : InOut  boolean ;\n    variable MultiLineComment : inout  boolean \n  ) is\n    variable Valid : boolean ;\n    variable Next2Char  : string(1 to 2) ;\n    constant NBSP  : CHARACTER := CHARACTER'val(160);  -- space character\n  begin\n    if MultiLineComment then \n      FindCommentEnd(L, Empty, MultiLineComment) ; \n    end if ; \n    \n    EmptyCheckLoop : while not MultiLineComment loop \n      SkipWhiteSpace(L, Empty) ; \n      exit when Empty ; -- line null or 0 in length detected by SkipWhite\n      \n      Empty := TRUE ; \n\n      exit when L.all(L'left) = '#' ; -- shell style comment\n      \n      if L.all'length >= 2 then \n        if L'ascending then \n          Next2Char := L.all(L'left to L'left+1) ;\n        else \n          Next2Char := L.all(L'left downto L'left-1) ;\n        end if; \n        exit when Next2Char = \"//\" ; -- C style comment\n        exit when Next2Char = \"--\" ; -- VHDL style comment\n        \n        if Next2Char = \"/*\" then   -- C style multi line comment\n          FindCommentEnd(L, Empty, MultiLineComment) ;\n          exit when Empty ; \n          next EmptyCheckLoop ; -- Found end of comment, restart processing line\n        end if ; \n      end if ; \n      \n      Empty := FALSE ; \n      exit ; \n    end loop EmptyCheckLoop ;\n  end procedure EmptyOrCommentLine ;\n  \n  ------------------------------------------------------------\n  procedure ReadUntilDelimiterOrEOL(\n  ------------------------------------------------------------\n    variable L         : InOut line ; \n    variable Name      : InOut line ; \n    constant Delimiter : In    character ;\n    variable ReadValid : Out   boolean \n  ) is\n    variable NameStr   : string(1 to L'length) ; \n    variable ReadLen   : integer := 1 ; \n    variable Good      : boolean ; \n  begin\n    ReadValid := TRUE ; \n    for i in NameStr'range loop\n      Read(L, NameStr(i), Good) ; \n      ReadValid := ReadValid and Good ; \n      if NameStr(i) = Delimiter then \n        -- Read(L, NameStr(1 to i), ReadValid) ; \n        Name := new string'(NameStr(1 to i-1)) ;\n        exit ; \n      elsif i = NameStr'length then \n        -- Read(L, NameStr(1 to i), ReadValid) ; \n        Name := new string'(NameStr(1 to i)) ;\n        exit ;\n      end if ; \n    end loop ;        \n  end procedure ReadUntilDelimiterOrEOL ; \n  \n  ------------------------------------------------------------\n  procedure FindDelimiter(\n  ------------------------------------------------------------\n    variable L                : InOut line ; \n    constant Delimiter        : In    character ;\n    variable Found            : Out   boolean \n  ) is\n    variable Char       : Character ; \n    variable ReadValid  : boolean ; \n  begin\n    Found := FALSE ; \n    ReadLoop : loop \n      if Delimiter /= ' ' then \n        SkipWhiteSpace(L) ; \n      end if ; \n      \n      Read(L, Char, ReadValid) ;\n      exit when ReadValid = FALSE or Char /= Delimiter ; \n      Found := TRUE ; \n      exit ; \n    end loop ;\n  end procedure FindDelimiter ; \n\n  ------------------------------------------------------------\n  procedure ReadHexToken (\n  -- Reads Upto Result'length values, less is ok.\n  -- Does not skip white space\n  ------------------------------------------------------------\n    variable L      : InOut line ;\n    variable Result : Out   std_logic_vector ;\n    variable StrLen : Out   integer \n  ) is\n    constant NumHexChars   : integer := (Result'length+3)/4 ;\n    constant ResultNormLen : integer := NumHexChars * 4 ; \n    variable NextChar      : character ; \n    variable CharCount     : integer ; \n    variable ReturnVal     : std_logic_vector(ResultNormLen-1 downto 0) ;\n    variable ReadVal       : std_logic_vector(3 downto 0) ; \n    variable ReadValSl     : std_logic ; \n    variable ReadValid     : boolean ; \n  begin\n    ReturnVal := (others => '0') ;\n    CharCount := 0 ; \n    \n    ReadLoop : while L /= null and L.all'length > 0 loop\n      NextChar := L.all(L'left) ; \n--      if ishex(NextChar) or NextChar = 'X' or NextChar = 'Z' then \n      if IsHexOrStdLogic(NextChar) then \n        -- Currently hread only handles X or Z\n        if IsHex(NextChar) then\n          hread(L, ReadVal, ReadValid) ; \n        else\n          read(L, ReadValSl, ReadValid) ; \n          ReadVal := ReadValSl & ReadValSl & ReadValSl & ReadValSl ; \n        end if ; \n        ReturnVal := ReturnVal(ResultNormLen-5 downto 0) & ReadVal ; \n        CharCount := CharCount + 1 ; \n        exit ReadLoop when CharCount >= NumHexChars ; \n      elsif NextChar = '_' then \n        read(L, NextChar, ReadValid) ; \n      else\n        exit ; \n      end if ; \n    end loop ReadLoop ;\n    \n    if CharCount >= NumHexChars then \n      StrLen := Result'length ; \n    else\n      StrLen := CharCount * 4 ; \n    end if ; \n    \n    Result := ReturnVal(Result'length-1 downto 0) ; \n  end procedure ReadHexToken ; \n    \n  ------------------------------------------------------------\n  procedure ReadBinaryToken (\n  -- Reads Upto Result'length values, less is ok.\n  -- Does not skip white space\n  ------------------------------------------------------------\n    variable L      : InOut line ;\n    variable Result : Out   std_logic_vector ;\n    variable StrLen : Out   integer \n  ) is\n    variable NextChar       : character ; \n    variable CharCount      : integer ; \n    variable ReadVal        : std_logic ; \n    variable ReturnVal      : std_logic_vector(Result'length-1 downto 0) ;\n    variable ReadValid      : boolean ; \n  begin\n    ReturnVal := (others => '0') ;\n    CharCount := 0 ; \n    \n    ReadLoop : while L /= null and L.all'length > 0 loop\n      NextChar := L.all(L'left) ; \n      if isstd_logic(NextChar) then \n        read(L, ReadVal, ReadValid) ; \n        ReturnVal := ReturnVal(Result'length-2 downto 0) & ReadVal ; \n        CharCount := CharCount + 1 ; \n        exit ReadLoop when CharCount >= Result'length ; \n      elsif NextChar = '_' then \n        read(L, NextChar, ReadValid) ; \n      else\n        exit ; \n      end if ; \n    end loop ReadLoop ;\n    \n    StrLen := CharCount ; \n    Result := ReturnVal ;\n  end procedure ReadBinaryToken ;   \n  \n  ------------------------------------------------------------\n  -- RemoveHLTable\n  --   Convert L to 0 and H to 1, and nothing else\n  ------------------------------------------------------------\n  constant RemoveHLTable : stdulogic_indexby_stdulogic := (\n      'U'   => 'U', \n      'X'   => 'X', \n      '0'   => '0', \n      '1'   => '1', \n      'Z'   => 'Z', \n      'W'   => 'W', \n      'L'   => '0', \n      'H'   => '1', \n      '-'   => '-'\n  ); \n  \n  ------------------------------------------------------------\n  -- local\n  function RemoveHL(A : std_ulogic_vector) return std_ulogic_vector is \n  ------------------------------------------------------------\n--    variable result : A'subtype ;\n    variable result : std_ulogic_vector(A'range) ;\n  begin\n    for i in result'range loop \n      result(i) := RemoveHLTable(A(i)) ;\n    end loop ; \n    return result ; \n  end function RemoveHL ;\n  \n  ------------------------------------------------------------\n  -- local_to_hxstring  \n  function local_to_hxstring ( A : std_ulogic_vector; IsSigned : Boolean := TRUE ) return string is\n  -- Code based on to_hstring from std_logic_1164-body.vhd\n  -- Copyright 2019 IEEE P1076 WG Authors\n  -- License:  Apache License 2.0 - same as this package\n  ------------------------------------------------------------\n    constant STRING_LEN   : integer := (A'length+3)/4;\n    variable result       : string(1 to STRING_LEN);\n    constant EXTEND_A_LEN : integer := STRING_LEN*4 ;\n    variable ExtendedA    : std_ulogic_vector(1 to EXTEND_A_LEN) ; \n    variable PadA         : std_ulogic_vector(1 to EXTEND_A_LEN - A'length) ; \n    variable HexVal       : std_ulogic_vector(1 to 4) ; \n    variable PrintBinary  : boolean := FALSE ; \n  begin\n    if A'length = 0 then \n      return \"\" ;\n    end if ; \n    if IsSigned or is_x(A(A'left)) then \n      PadA := (others => A(A'left)) ; \n    else\n      PadA := (others => '0') ; \n    end if ; \n    ExtendedA := RemoveHL(PadA & A) ; \n    for i in result'range loop\n      HexVal := ExtendedA(4*i-3 to 4*i);\n      case HexVal is\n        when X\"0\"   => result(i) := '0';\n        when X\"1\"   => result(i) := '1';\n        when X\"2\"   => result(i) := '2';\n        when X\"3\"   => result(i) := '3';\n        when X\"4\"   => result(i) := '4';\n        when X\"5\"   => result(i) := '5';\n        when X\"6\"   => result(i) := '6';\n        when X\"7\"   => result(i) := '7';\n        when X\"8\"   => result(i) := '8';\n        when X\"9\"   => result(i) := '9';\n        when X\"A\"   => result(i) := 'A';\n        when X\"B\"   => result(i) := 'B';\n        when X\"C\"   => result(i) := 'C';\n        when X\"D\"   => result(i) := 'D';\n        when X\"E\"   => result(i) := 'E';\n        when X\"F\"   => result(i) := 'F';\n        when \"UUUU\" => result(i) := 'U';\n        when \"XXXX\" => result(i) := 'X';\n        when \"ZZZZ\" => result(i) := 'Z';\n        when \"WWWW\" => result(i) := 'W';\n        when \"----\" => result(i) := '-';\n        when others => result(i) := '?';  PrintBinary := TRUE ;\n      end case;\n    end loop;\n    if PrintBinary then \n      return result & \" (\" & to_string(A) & \")\" ;\n    else \n      return result ; \n    end if ; \n  end function local_to_hxstring;\n  \n\n  ------------------------------------------------------------\n  -- to_hxstring  \n  function to_hxstring ( A : std_ulogic_vector) return string is \n  ------------------------------------------------------------\n  begin\n    return local_to_hxstring(A, IsSigned => FALSE) ; \n  end function to_hxstring ; \n\n  ------------------------------------------------------------\n  -- to_hxstring  \n  function to_hxstring ( A : unsigned) return string is \n  ------------------------------------------------------------\n  begin\n    return local_to_hxstring(std_ulogic_vector(A), IsSigned => FALSE) ; \n  end function to_hxstring ; \n\n  ------------------------------------------------------------\n  -- to_hxstring  \n  function to_hxstring (A : signed) return string is \n  ------------------------------------------------------------\n  begin\n    return local_to_hxstring(std_ulogic_vector(A), IsSigned => TRUE) ; \n  end function to_hxstring ; \n  \n  ------------------------------------------------------------\n  -- Justify\n  --   w/ Fill Character\n  --   w/o Fill character, Parameter order & names sensible\n  ------------------------------------------------------------\n  function Justify (\n    S       : string ;\n    Fill    : character ;\n    Amount  : natural ;\n    Align   : AlignType := LEFT\n  ) return string is\n    constant FillLen     : integer := maximum(1, Amount - S'length) ; \n    constant HalfFillLen : integer := (FillLen+1)/2 ; \n    constant FillString  : string(1 to  FillLen) := (others => FILL) ;\n  begin\n    if S'length >= Amount then\n      return S ;\n    end if ;\n    \n    case Align is\n      when LEFT   =>  return S & FillString ; \n      when RIGHT  =>  return FillString & S ;\n      when CENTER =>  return FillString(1 to HalfFillLen) & S & FillString(HalfFillLen+1 to FillLen) ; \n    end case ; \n  end function Justify ; \n\n  function Justify (\n    S       : string ;\n    Amount  : natural ;\n    Align   : AlignType := LEFT\n  ) return string is\n  begin\n    return Justify(S, ' ', Amount, Align) ; \n  end function Justify ;   \n  \n  ------------------------------------------------------------\n  -- FileExists\n  --    Return TRUE if file exists\n  ------------------------------------------------------------\n  impure function FileExists(FileName : string) return boolean is \n    file     FileID : text ;\n    variable status : file_open_status ;\n  begin\n    file_open(status, FileID, FileName, READ_MODE) ;\n    file_close(FileID) ;\n    return status = OPEN_OK ; \n  end function FileExists ;   \n\nend package body TextUtilPkg ;","lang":"vhdl"};
processSrcData(g_data);