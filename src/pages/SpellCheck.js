import { Box, Button, debounce, TextField, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { USER_LOCAL_STORAGE_KEY } from "../App";

export const SpellCheck = ({ onAfterLogout }) => {
  // we need to use the ref here cause it's not reflacting to the function as we calling it direct after the onChange
  const enteredTextRef = useRef("");
  const [misspelledWords, setMisspelledWords] = useState([]);

  const onCheckSpelling = useCallback(async () => {
    const enteredText = enteredTextRef.current.trim();
    if (!enteredText) {
      setMisspelledWords([]);
      enteredTextRef.current = "";
      return;
    }

    const promptMessage = `Please check the following text for spelling errors. 
    List all the misspelled words with the key "words" in an array format.
    Format should be like this:
    {
      "words": [{
      "misspelledWord": "word1",
      "correctWord": "word1"
      }]
    }
    Text: "${enteredText}"`;

    const params = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a spelling and grammar checker." },
        { role: "user", content: promptMessage },
      ],
      max_tokens: 2000,
      temperature: 0,
      n: 1,
    };

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_CHAT_GPT_API_KEY}`,
      },
      body: JSON.stringify(params),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_CHAT_GPT_BASE_URL}/v1/chat/completions`,
        config
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const misspelledWords = data.choices[0].message.content;

      const misspelledWordsArray = JSON.parse(misspelledWords);

      const newMisspelledWords = misspelledWordsArray.words;

      setMisspelledWords((prev) => [...newMisspelledWords, ...prev]);
    } catch (error) {
      console.error("Error during spell check:", error);
    }
  }, [enteredTextRef]);

  // debounce to prevent multiple calls to the API
  const debouncedOnCheckSpelling = debounce(() => {
    onCheckSpelling();
  }, 300);

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          backgroundColor: "#0f0f0f",
        }}
      >
        <Typography variant="h5" color="#fff">
          Spell Checker
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          sx={{
            textTransform: "none",
          }}
          onClick={() => {
            localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
            onAfterLogout();
          }}
        >
          Logout
        </Button>
      </Box>

      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 600,
          margin: "0 auto",
          gap: 3,
        }}
      >
        {enteredTextRef.current && (
          <Box
            sx={{
              borderRadius: 3,
              background: "#fefefe",
              p: 2,
              width: "100%",
              maxWidth: "-webkit-fill-available",
            }}
          >
            <Typography variant="caption" fontSize={14}>
              <MisspelledTextHighlighter
                text={enteredTextRef.current}
                misspelledWords={misspelledWords}
              />
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          multiline
          placeholder="Enter text to check"
          minRows={5}
          maxRows={10}
          color="#0f0f0f"
          onChange={(e) => {
            enteredTextRef.current = e.target.value;
            debouncedOnCheckSpelling();
          }}
          InputProps={{
            sx: {
              fontSize: 14,
              borderRadius: 3,
              fontWeight: 500,
            },
          }}
        />
      </Box>
    </Box>
  );
};

const MisspelledTextHighlighter = ({ text, misspelledWords }) => {
  const renderHighlightedText = () => {
    if (!text || misspelledWords.length === 0) {
      return { __html: text };
    }

    const regex = new RegExp(
      misspelledWords.map((word) => word.misspelledWord).join("|"),
      "gi"
    );

    const highlightedText = text.replace(regex, (matchedWord) => {
      const correctWord = misspelledWords.find(
        (word) => word.misspelledWord === matchedWord
      )?.correctWord;
      return `<tooltip title=${correctWord}><span style="color: red; font-weight: bold;">${matchedWord}</span></tooltip>`;
    });

    return { __html: highlightedText };
  };

  return <span dangerouslySetInnerHTML={renderHighlightedText()} />;
};
