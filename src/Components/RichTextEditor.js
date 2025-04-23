'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ align: [] }, { color: [] }, { background: [] }],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image',
  'align', 'color', 'background',
];

export default function RichTextEditor({ value, onChange }) {
  return (
    <div className="bg-white text-black">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing your blog here..."
        className="h-[300px]"
      />
    </div>
  );
}
