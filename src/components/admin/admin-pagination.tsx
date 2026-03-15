"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function AdminPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
}: AdminPaginationProps) {
    if (totalItems === 0) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-gallery-charcoal/20">
            <div className="text-sm font-medium text-gallery-charcoal/70 mb-4 sm:mb-0 uppercase tracking-widest">
                Showing <span className="text-gallery-black font-bold">{startItem}</span> to <span className="text-gallery-black font-bold">{endItem}</span> of <span className="text-gallery-black font-bold">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-8 rounded-none border-gallery-charcoal/20 text-xs uppercase tracking-widest font-bold bg-gallery-cream hover:bg-gallery-charcoal hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                </Button>

                <div className="flex items-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first, last, and pages around current page
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => onPageChange(page)}
                                    className={`h-8 w-8 rounded-none border-y border-l last:border-r border-gallery-charcoal/20 text-xs font-bold transition-colors ${currentPage === page
                                            ? "bg-gallery-black text-white px-0"
                                            : "bg-white text-gallery-charcoal hover:bg-gallery-cream px-0"
                                        }`}
                                >
                                    {page}
                                </Button>
                            );
                        } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                        ) {
                            return (
                                <span key={page} className="px-2 text-gallery-charcoal/50 border-y border-l border-gallery-charcoal/20 h-8 flex items-center">
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="h-8 rounded-none border-gallery-charcoal/20 text-xs uppercase tracking-widest font-bold bg-gallery-cream hover:bg-gallery-charcoal hover:text-white transition-colors"
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
