import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string; images: string[] }) => Promise<void>;
  loading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (rating === 0) {
      setError("Silakan pilih rating");
      return;
    }

    if (comment.length < 10) {
      setError("Komentar minimal 10 karakter");
      return;
    }

    if (comment.length > 1000) {
      setError("Komentar maksimal 1000 karakter");
      return;
    }

    if (images.length > 5) {
      setError("Maksimal 5 gambar");
      return;
    }

    try {
      await onSubmit({ rating, comment, images });
      setSuccess(true);
      
      setRating(0);
      setComment("");
      setImages([]);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim review");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Tulis Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-slate-600">
                  {rating === 1 && "Sangat Buruk"}
                  {rating === 2 && "Buruk"}
                  {rating === 3 && "Cukup"}
                  {rating === 4 && "Bagus"}
                  {rating === 5 && "Sangat Bagus"}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="comment">Komentar</Label>
              <span className="text-xs text-slate-500">
                {comment.length}/1000
              </span>
            </div>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bagikan pengalaman Anda di destinasi ini..."
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            {comment.length < 10 && comment.length > 0 && (
              <p className="text-xs text-amber-600">
                Minimal {10 - comment.length} karakter lagi
              </p>
            )}
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Foto (Opsional, maksimal 5)</Label>
            <div className="space-y-2">
              {images.length < 5 && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="URL gambar"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.currentTarget;
                        if (input.value && images.length < 5) {
                          setImages([...images, input.value]);
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                      if (input.value && images.length < 5) {
                        setImages([...images, input.value]);
                        input.value = "";
                      }
                    }}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Tambah
                  </Button>
                </div>
              )}
              
              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-500 bg-green-50">
              <AlertDescription className="text-green-800">
                Review berhasil dikirim! 🎉
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || rating === 0 || comment.length < 10}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Review"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
