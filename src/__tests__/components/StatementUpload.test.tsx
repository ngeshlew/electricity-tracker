// Test file for StatementUpload component
import { render, screen, fireEvent } from '@testing-library/react';
import { StatementUpload } from '../../components/statements/StatementUpload';

// Mock react-dropzone
jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(() => ({
    getRootProps: jest.fn(() => ({
      'data-testid': 'dropzone'
    })),
    getInputProps: jest.fn(() => ({
      'data-testid': 'file-input'
    })),
    isDragActive: false
  }))
}));

const mockOnFileUpload = jest.fn();
const mockOnFileRemove = jest.fn();

const mockUploadedFiles = [
  {
    id: '1',
    file: new File(['test content'], 'test.pdf', { type: 'application/pdf' }),
    status: 'success' as const
  },
  {
    id: '2',
    file: new File(['test content'], 'test.csv', { type: 'text/csv' }),
    status: 'uploading' as const
  },
  {
    id: '3',
    file: new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    status: 'error' as const,
    error: 'Invalid file format'
  }
];

describe('StatementUpload', () => {
  beforeEach(() => {
    mockOnFileUpload.mockClear();
    mockOnFileRemove.mockClear();
  });

  it('renders upload component with correct title', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={[]}
        isUploading={false}
      />
    );

    expect(screen.getByText('Upload Energy Statements')).toBeInTheDocument();
    expect(screen.getByText('Upload your energy bills in PDF, CSV, or Excel format for automatic processing')).toBeInTheDocument();
  });

  it('renders drop zone with correct text', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={[]}
        isUploading={false}
      />
    );

    expect(screen.getByText('Drag & drop files here')).toBeInTheDocument();
    expect(screen.getByText('or click to browse files')).toBeInTheDocument();
  });

  it('shows supported file formats', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={[]}
        isUploading={false}
      />
    );

    expect(screen.getByText('Supported formats: .pdf, .csv, .xlsx')).toBeInTheDocument();
    expect(screen.getByText('Maximum 5 files, up to 10MB each')).toBeInTheDocument();
  });

  it('renders uploaded files when provided', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={mockUploadedFiles}
        isUploading={false}
      />
    );

    expect(screen.getByText('Uploaded Files (3)')).toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    expect(screen.getByText('test.xlsx')).toBeInTheDocument();
  });

  it('shows file status indicators', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={mockUploadedFiles}
        isUploading={false}
      />
    );

    // Should show error message for failed upload
    expect(screen.getByText('Invalid file format')).toBeInTheDocument();
  });

  it('calls onFileRemove when remove button is clicked', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={mockUploadedFiles}
        isUploading={false}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    expect(mockOnFileRemove).toHaveBeenCalledWith('1');
  });

  it('disables remove button for uploading files', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={mockUploadedFiles}
        isUploading={false}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    // The second file is uploading, so its remove button should be disabled
    expect(removeButtons[1]).toBeDisabled();
  });

  it('shows upload progress when isUploading is true', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={[]}
        isUploading={true}
      />
    );

    expect(screen.getByText('Processing files...')).toBeInTheDocument();
  });

  it('disables drop zone when uploading', () => {
    const { useDropzone } = require('react-dropzone');
    useDropzone.mockReturnValue({
      getRootProps: jest.fn(() => ({
        'data-testid': 'dropzone'
      })),
      getInputProps: jest.fn(() => ({
        'data-testid': 'file-input'
      })),
      isDragActive: false
    });

    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={[]}
        isUploading={true}
      />
    );

    // The dropzone should be disabled when uploading
    expect(useDropzone).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true
      })
    );
  });

  it('formats file sizes correctly', () => {
    const largeFile = new File(['x'.repeat(1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const filesWithSizes = [
      {
        id: '1',
        file: largeFile,
        status: 'success' as const
      }
    ];

    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={filesWithSizes}
        isUploading={false}
      />
    );

    expect(screen.getByText('1 MB')).toBeInTheDocument();
  });

  it('shows correct file icons for different file types', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={mockUploadedFiles}
        isUploading={false}
      />
    );

    // Should have file icons for each file type
    const fileIcons = screen.getAllByRole('img', { hidden: true });
    expect(fileIcons).toHaveLength(3);
  });

  it('handles empty uploaded files list', () => {
    render(
      <StatementUpload
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        uploadedFiles={[]}
        isUploading={false}
      />
    );

    expect(screen.queryByText('Uploaded Files')).not.toBeInTheDocument();
  });
});
