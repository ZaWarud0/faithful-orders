import React from 'react';
import './PreLoader.css';

import { Loader } from 'semantic-ui-react';

const PreLoader = () => {
    return(
    <div id="preLoaderContainer">
        <Loader active size='massive' />
    </div>
    )
}

export default PreLoader;