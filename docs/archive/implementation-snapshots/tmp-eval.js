(function(){
  if(typeof CS !== 'undefined' && CS.buildState){
    var bs = CS.buildState;
    return JSON.stringify({
      stage: bs._stage,
      slots: bs._slots ? Object.keys(bs._slots) : null,
      deptCount: bs._departmentCount,
      primaryDept: bs._primaryDept,
      investment: bs._investment
    });
  }
  return 'no_CS_buildState';
})()
