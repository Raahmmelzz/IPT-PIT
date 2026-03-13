from django.contrib import admin
from django.utils.html import format_html
from .models import Order, Customer, Product

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_ref', 'customer_name', 'items_summary', 'total_qty', 'total_price', 'status_badge')
    list_filter = ('is_paid', 'payment_method')

    def get_queryset(self, request):
        """
        Logic to only show the FIRST item of every checkout group.
        This prevents the list from showing every single row for the same purchase.
        """
        qs = super().get_queryset(request)
        all_orders = list(qs.order_by('date', 'orderid'))
        unique_group_ids = []
        seen_sessions = set()

        for o in all_orders:
            # Create a unique key based on Customer and Time (2-second window)
            session_key = f"{o.customerid_id}_{o.date.strftime('%Y-%m-%d %H:%M:%S')[:-1]}"
            if session_key not in seen_sessions:
                unique_group_ids.append(o.orderid)
                seen_sessions.add(session_key)
        
        return qs.filter(orderid__in=unique_group_ids)

    # 1. Sequential Order Ref
    def order_ref(self, obj):
        # Dynamically calculates row number 1, 2, 3...
        all_groups = self.get_queryset(None)
        return list(all_groups).index(obj) + 1
    order_ref.short_description = 'ORDER REF #'

    # 2. Customer Name
    def customer_name(self, obj):
        return obj.customerid.name

    # 3. Items Summary (e.g., Burger +2 items)
    def items_summary(self, obj):
        # Find all items that belong to this checkout session
        session_time = obj.date.strftime('%Y-%m-%d %H:%M:%S')[:-1]
        related_items = Order.objects.filter(
            customerid=obj.customerid,
            date__icontains=session_time
        )
        count = related_items.count()
        first_item = obj.productid.productname
        if count > 1:
            return f"{first_item} (+{count - 1} items)"
        return first_item
    items_summary.short_description = 'ITEMS PURCHASED'

    # 4. Total Qty for the whole checkout
    def total_qty(self, obj):
        session_time = obj.date.strftime('%Y-%m-%d %H:%M:%S')[:-1]
        return sum(Order.objects.filter(
            customerid=obj.customerid,
            date__icontains=session_time
        ).values_list('quantity', flat=True))
    total_qty.short_description = 'QTY'

    # 5. Total Price for the whole checkout
    def total_price(self, obj):
        session_time = obj.date.strftime('%Y-%m-%d %H:%M:%S')[:-1]
        total = sum(Order.objects.filter(
            customerid=obj.customerid,
            date__icontains=session_time
        ).values_list('price', flat=True))
        return format_html('<span style="color: #6366f1; font-weight: bold;">₱{}</span>', f"{total:.2f}")
    total_price.short_description = 'TOTAL PRICE'

    # 6. Status Badge
    def status_badge(self, obj):
        bg, color = ("#dcfce7", "#166534") if obj.is_paid else ("#fef9c3", "#854d0e")
        text = "PAID" if obj.is_paid else "PENDING"
        return format_html(
            '<span style="background: {}; color: {}; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 10px;">{}</span>',
            bg, color, text
        )
    status_badge.short_description = 'STATUS'