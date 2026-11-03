#!/bin/bash
# usage: scripts/still.sh <sceneId> <fractionOfScene 0..1> [out]
cd "$(dirname "$0")/.."
F=$(python3 -c "
import json,sys;t=json.load(open('public/timeline.json'))
s=[x for x in t['scenes'] if x['id']=='$1'][0];print(int(s['from']+s['dur']*$2))")
npx remotion still src/index.ts Vascular "${3:-out/stills/$1_$2.png}" --frame=$F --log=error
