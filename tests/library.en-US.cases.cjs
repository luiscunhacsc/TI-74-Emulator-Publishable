'use strict';
// Independent expected LCD output and keyboard input for each English example.
module.exports={
 '01-hello':[['','HELLO,TI-74!']],
 '02-arithmetic':[['','A=14B=20'],['\n','C=41']],
 '03-sum':[['','SUM=55']],
 '04-countdown':[['','3'],['\n','2'],['\n','1'],['\n','GO']],
 '05-temperature':[['','CELSIUS?'],['25\n','F=77']],
 '06-decisions':[['','NUMBER0TO100?'],['-1\n','INTEGERFROM0TO100'],['\n','NUMBER0TO100?'],['2.5\n','INTEGERFROM0TO100'],['\n','NUMBER0TO100?'],['7\n','ODD']],
 '07-strings':[['','BASIC/ALC'],['\n','LEN=8POS=5']],
 '08-ascii':[['','ASCII=65'],['\n','LETTER=B'],['\n','DOUBLE=25']],
 '09-data':[['','TOTAL=30'],['\n','FIRST=4']],
 '10-statistics':[['','MEAN=5'],['\n','STDDEV=2']],
 '11-matrix':[['','DET=-2']],
 '12-gosub':[['','H1=5'],['\n','H2=13']],
 '13-subprogram':[['','DOUBLE=14']],
 '14-science':[['',/^DEGREES=0?\.5$/],['\n',/^RADIANS=0?\.5$/],['\n','LOG=3LNEXP=2']],
 '15-formatting':[['','12.50'],['\n','3.14']],
 '16-dice':[['',/^DICE=[1-6][1-6]$/],['\n',/^SUM=([2-9]|1[0-2])$/]],
 '17-sorting':[['','1'],['\n','2'],['\n','4'],['\n','7'],['\n','9']],
 '18-display':[['','TI-74********'],['\n','COLUMN8']],
 '19-keyboard':[['','PRESSALETTER'],['A','KEY=A'],['\n','CODE=65']],
 '20-newton':[['','POSITIVENUMBER?'],['2\n',/^NEWTON=1\.41421356\d*$/],['\n',/^SQR=1\.41421356\d*$/]]
};
