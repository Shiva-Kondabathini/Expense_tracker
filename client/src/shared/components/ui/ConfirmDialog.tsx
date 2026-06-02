interface ConfirmDialogProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ title, onConfirm, onCancel }: ConfirmDialogProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold">{title}</h2>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg bg-slate-700 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
