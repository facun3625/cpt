import { getMatriculados, getMatriculadosUploadInfo } from "@/lib/site-info";
import { MatriculadosUploadForm } from "@/components/admin/matriculados-upload-form";
import { MatriculadosTable } from "@/components/admin/matriculados-table";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function MatriculadosAdminPage() {
  const [matriculados, uploadInfo] = await Promise.all([getMatriculados(), getMatriculadosUploadInfo()]);

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-ink-900">Matriculados habilitados</h1>
      <p className="mt-1 text-sm text-ink-600">Listado de matriculados habilitados, cargado por CSV.</p>

      <div className="mt-6">
        <MatriculadosUploadForm
          uploadInfo={
            uploadInfo
              ? {
                  uploadedAtText: dateFormatter.format(uploadInfo.uploadedAt),
                  cantidad: uploadInfo.cantidad,
                  nombreArchivo: uploadInfo.nombreArchivo,
                }
              : null
          }
        />
      </div>

      <MatriculadosTable matriculados={matriculados} />
    </div>
  );
}
