import * as G from './v_general';
import * as V1 from './v_ch1';
import * as V2 from './v_ch2';
import * as V3 from './v_ch3';
import * as V4 from './v_ch4';
import * as V5 from './v_ch5';
import * as V6 from './v_ch6';
export const VISUALS: Record<string, React.FC> = { ...G, ...V1, ...V2, ...V3, ...V4, ...V5, ...V6 } as any;
