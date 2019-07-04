import { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


class CKEditorWrapper extends Component {
    render() {
        return(
            <div>
                <CKEditor
                    editor={ ClassicEditor }
                    {...this.props}
                />
            </div>
        )
    }
}

export default CKEditorWrapper;