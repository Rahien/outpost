import Markdown from "markdown-to-jsx";
import { ResourceIcon } from "./resourceIcon";
import { RESOURCES } from "../types";
import { characterClasses } from "../characterStore";
import { ClassIcon } from "./characterIcon";
import { EffectIcon, effectOffsets } from "./effectIcon";

const components: Record<string, React.ComponentType> = {};

RESOURCES.forEach((resource) => {
  components[resource] = () => {
    return <ResourceIcon resource={resource} inline size="tiny" />;
  };
});

Object.keys(characterClasses).forEach((characterClass) => {
  components[characterClass] = () => {
    return (
      <ClassIcon
        charClass={characterClasses[characterClass]}
        inline
        size="tiny"
      />
    );
  };
});

Object.keys(effectOffsets).forEach((effect) => {
  components[effect] = () => {
    return <EffectIcon effect={effect} inline size="tiny" />;
  };
});

const overrides: Record<string, { component: React.ComponentType }> = {};
Object.keys(components).forEach((key) => {
  overrides[key] = { component: components[key] };
});

export const CustomMarkdown = ({ children }: { children: string }) => {
  return (
    <Markdown
      options={{
        overrides,
      }}
    >
      {children}
    </Markdown>
  );
};
