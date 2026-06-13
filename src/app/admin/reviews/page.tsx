import { AdminReviewsPanel } from "@/components/admin/AdminReviewsPanel";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export default async function AdminReviewsPage() {
  await requireAdmin();

  const reviews = await prisma.agentReview.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { fullName: true, email: true } },
      teamAgent: { select: { name: true } },
    },
  });

  const initialReviews = reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt.toISOString(),
    user: review.user,
    teamAgent: review.teamAgent,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">รีวิวเอเจนต์</h1>
      <p className="mt-2 text-slate-600">อนุมัติหรือปฏิเสธรีวิวจากผู้ใช้ก่อนแสดงบนหน้า /agents</p>
      <div className="mt-8">
        <AdminReviewsPanel initialReviews={initialReviews} />
      </div>
    </div>
  );
}
