// Components available inside every MDX file without imports.
import Fact from './Fact.astro';
import Cite from './Cite.astro';
import Abbr from './Abbr.astro';
import Callout from './Callout.astro';
import Note from './Note.astro';
import Figure from './Figure.astro';
import DataTable from './DataTable.astro';
import CodeBlock from './CodeBlock.astro';
import Compare from './Compare.astro';
import Sequence from './diagrams/Sequence.astro';
import Explainer from './diagrams/Explainer.astro';
import Stack from './diagrams/Stack.astro';
import Flow from './diagrams/Flow.astro';
import Timeline from './diagrams/Timeline.astro';
import Quadrant from './diagrams/Quadrant.astro';
import RailMap from './diagrams/RailMap.astro';
import NetVsGross from './diagrams/NetVsGross.astro';
import RailsTable from './RailsTable.astro';
import BoxDiagram from './diagrams/BoxDiagram.astro';
import CapacityChart from './diagrams/CapacityChart.astro';
import BuildBuyScorer from './BuildBuyScorer.astro';

export const mdxComponents = { Fact, Cite, Abbr, Callout, Note, Figure, DataTable, CodeBlock, Compare, Sequence, Explainer, Stack, Flow, Timeline, Quadrant, RailMap, NetVsGross, RailsTable, BoxDiagram, CapacityChart, BuildBuyScorer };
