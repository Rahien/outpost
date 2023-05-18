import { Button, TextField } from "@mui/material";
import { useCharacterStore } from "../characterStore";
import { useEffect, useRef, useState } from "react";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import { Title } from "./Title";
import { spacing } from "../tokens";
import { CustomMarkdown, overrides } from "./customMarkdown";
import React from "react";

type AutoCompleteItem = {
  name: string;
  component: React.ComponentType;
};

const AutoCompleteSuggestion = ({
  selected,
  entity,
}: {
  selected: boolean;
  entity: { name: string; component: React.ComponentType };
}) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <div>{entity.name}</div>
      <entity.component />
    </div>
  );
};

const MultiLineTextField = React.forwardRef((props, ref) => {
  const { onChange, onBlur, onClick, onKeyDown, onScroll, onSelect, value } =
    props as any;
  return (
    <TextField
      type={"text"}
      multiline
      fullWidth
      inputProps={{
        onChange,
        // onBlur, disabled because the callback inside Input has been passed wrongly
        onClick,
        onKeyDown,
        onScroll,
        onSelect,
      }}
      placeholder="Write some notes or use :fire: to create fire!"
      value={value}
      inputRef={ref}
    />
  );
});

export const CharacterNotes = () => {
  const { character, updateCharacter } = useCharacterStore(
    ({ character, updateCharacter }) => ({
      character,
      updateCharacter,
    })
  );
  const [value, setValue] = useState<string>(character?.notes || "");
  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setEditing(false));
  useEffect(() => {
    if (!editing && character && value !== character.notes) {
      updateCharacter({ ...character, notes: value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const autoCompleteConfig = {
    dataProvider: (token: string) => {
      const matches = Object.keys(overrides)
        .filter((key) => key.toLowerCase().startsWith(token.toLowerCase()))
        .map((key) => {
          return {
            name: key,
            component: overrides[key].component,
          } as AutoCompleteItem;
        });
      matches.sort((a, b) => a.name.localeCompare(b.name));
      return matches.slice(0, 5);
    },
    component: AutoCompleteSuggestion,
    output: (item: AutoCompleteItem, _trigger: any) => `<${item.name}/>`,
  };
  return (
    <div ref={ref} onClick={() => setEditing(true)}>
      <Title title="Notes:" />
      {editing ? (
        <div
          css={{
            position: "relative",
            marginTop: spacing.small,
            ".rta__autocomplete": {
              position: "absolute",
              marginTop: 44,
              zIndex: 100,
              background: "white",
              border: "1px solid black",
              boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
              padding: 0,
              ".rta__list": {
                margin: 0,
                padding: 0,
                width: "200px",
              },
              li: {
                listStyle: "none",
                padding: `${spacing.small} ${spacing.medium}`,
              },
              ".rta__entity": {
                width: "100%",
              },
              ".rta__item--selected": {
                background: "rgba(0,0,0,0.1)",
              },
              "&.rta__autocomplete--top": {
                marginTop: 0,
              },
            },
          }}
        >
          <ReactTextareaAutocomplete<AutoCompleteItem>
            className="my-textarea"
            loadingComponent={() => <>loading...</>}
            style={{
              fontSize: "18px",
              lineHeight: "20px",
              padding: 5,
            }}
            containerStyle={{
              marginTop: 20,
              width: `100%`,
            }}
            textAreaComponent={MultiLineTextField as any}
            minChar={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            trigger={{
              "<": autoCompleteConfig,
              ":": autoCompleteConfig,
            }}
          />

          <Button
            variant="outlined"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditing(false);
            }}
            css={{
              position: "absolute",
              bottom: spacing.tiny,
              right: spacing.tiny,
            }}
          >
            Done
          </Button>
        </div>
      ) : (
        <div css={{ marginTop: spacing.small }}>
          <CustomMarkdown>{value}</CustomMarkdown>
        </div>
      )}
    </div>
  );
};
