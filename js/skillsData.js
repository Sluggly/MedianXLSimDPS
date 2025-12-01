// First Letter: L Lightning, F Fire, C Cold, P Poison, Y: Physical: M Magic
// Second Letter: L Low, H High
// Third Letter: S Scaling, B Base
let mindFlayScaling = { Base: { YLB: 25, YLS: 3.5416, YHB: 32, YHS: 3.75, LLB: 51, LLS: 6.583, LHB: 65, LHS: 7.9583 } };
let mindFlay = createSkill("Mind Flay","Paladin","Warlock",null,mindFlayScaling,25,true);