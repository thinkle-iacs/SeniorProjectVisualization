import './style.css'

import { fetchProjectData } from './getData';  // Ensure path is correct
import {createChart} from './chart';
async function init() {
  // Fetch the data
  const data = await fetchProjectData();
  createChart(data);
}

init();
