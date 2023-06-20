import {exportToBlob, loadFromBlob} from '@excalidraw/excalidraw';
import {useState} from 'react';
import {useParams} from 'react-router-dom';

function App() {
  const params = useParams();
  let [result, setResult] = useState("");
  let input = atob(params.data);
  let data = new Blob( [input], {type: "application/json"} );
  loadFromBlob( data ).then( ( blob ) => {
    return exportToBlob( {
      ...blob,
      mimeType: 'image/png',
      quality: 1,
    } );
  } ).then( ( blob ) => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      let res = reader.result.substring(reader.result.indexOf(',') + 1);
      setResult(res);
    }
  } );

  return (
    <>
      {result}
    </>
  );
}

export default App;
