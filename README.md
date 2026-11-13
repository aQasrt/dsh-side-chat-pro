# Side Chat Pro (dsh-side-chat-pro)

Select text inside a DSH conversation, then pick one of three actions: **ask in a side chat**, **translate**, or **explain the term**.

Forked from [dsh-side-chat-plus](https://github.com/heartmove/dsh-side-chat) (MIT, by heartmove / dsh-sub-chats contributors). All upstream features are kept; selection translate and concept explain are added.

## What's new

- **Three-way selection menu**: ask in side chat / translate / explain.
- **Context-aware translation**: the paragraph around the selection is sent along, and the model returns **1–5 candidate translations ranked by fit**, which handles the case where one English word means different things in different contexts.
- **Concept explain**: one to three sentences on what the term means here, also with the surrounding context.
- **Standalone popover**: translation and explanation appear next to the selection, with copy and close; nothing is written into the main conversation.
- Uses the side chat's current model and reasoning effort; high/xhigh/max effort is lowered to low for these short tasks so results come back faster.

## Upstream features kept

- Side-chat Q&A: an isolated hidden session per parent conversation, inheriting model and permissions.
- Draggable launcher button that remembers its position.
- Parent-conversation context: a new side chat starts with the last 5 turns (10k characters max) and can page further back with `sidechat_read_parent`.
- Durable side-chat records: they survive a DSH restart and only disappear when you end them explicitly.

## Install

```sh
dsh plugin --profile <your profile> add dsh-side-chat-pro
```

Restart DSH afterwards.

## Known limitations

- Built by patching the compiled output of upstream 0.5.2. `src/` is included for reading; rebuild from the upstream repository if you need sources.
- Selection only works inside the DSH window. For selecting text in other Windows apps, see `dsh-select-assist-plus`.
- Requires DSH `>=0.2.1-rc.1`.

## License

MIT. Original copyright belongs to dsh-sub-chats contributors (see [LICENSE](LICENSE)); the delta is described in [NOTICE](NOTICE).