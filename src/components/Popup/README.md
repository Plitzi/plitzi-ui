example calls

```
 const { internal, id, existsPopup, addPopup } = this.props;
    if (!existsPopup('toolbar')) {
      const title = (
        <>
          <i className="fas fa-paint-brush" />
          Style
        </>
      );
      addPopup('toolbar', <StyleInspector id={id} internal={internal} />, {
        title,
        placement: 'POPUP_PLACEMENT_FLOATING'
      });
    }
```