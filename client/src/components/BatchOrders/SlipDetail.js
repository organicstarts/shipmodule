import React from 'react';

const SlipDetail = () => {
    return (
        <div class="packing-slip" style="padding-bottom:0.85in;background:#fff;">
		<div class="row header" style="z-index:999;">
			<div class="col-4 text-center" style="padding-top:0.05in;z-index:999;">
				<img src="assets/images/os/logo.jpg" class="img-fluid" />
				<br>
				<i>"Healthy Starts from Day One."</i>
			</div>
			<div class="col-2 offset-6 text-center " style="z-index:999;color:#000!important;font-size:1.75em;">
				<br><strong>{{ ORDER.customer.count > 3 ? '&HorizontalLine;' : ORDER.customer.count | raw }}</strong><br>{{ ORDER.split ? 'SPLT <br>' : '' | raw }}{% if COUPON.code == 'gift' %}{{ ORDER.carrier == 'fedex' ? 'FDX <br>' : '' | raw }}{{ ORDER.tags | raw }}{{ ORDER.box | raw }}
			</div>
		</div>
		<div class="ui divider" style="margin:0.15in auto;border-color:#999;border-top:1px solid transparent;"></div>
		<div class="row details">
			<div class="col-7">
				<h1 style="font-size:180%!important;margin:0;">{{ ORDER.shipping.first_name|upper }} {{ ORDER.shipping.last_name|upper }}</h1>
				Customer <strong>#{{ ORDER.customer_id }}</strong><br>
				{{ ORDER.billing_address.email }}<br>
				{{ ORDER.shipping.company ? ORDER.shipping.company + '<br>' : '' }}
				{{ ORDER.shipping.street_1 }}<br>
				{{ ORDER.shipping.street_2 ? ORDER.shipping.street_2 + '<br>' : '' }}
				{{ ORDER.shipping.city }}, {{ ORDER.shipping.state }} {{ ORDER.shipping.zip }}<br>
			</div>
			<div class="col-5">
				<strong>{{ ORDER.items_total }}</strong> Total Items<br>
				Order <strong>#{{ ORDER.id }}</strong><br>
				Order placed on the <strong>{{ ORDER.created }}</strong>.<br>
				Shipped on the <strong>{{ ORDER.shipped }}</strong> 
				<small>{{ ORDER.timeAfter | raw }}</small>
			</div>
		</div>
		<div class="ui divider" style="margin:0.15in auto;border-color:#999;border-top:1px solid transparent;"></div>
		<table class="ui very basic table" style="border-color:#999;border-left:none;border-right:none;">
			{% if not ORDER.split %}
				<thead>
					<tr>
						<th style="border-top:none;"><strong>Product</strong></th>
					    <th class="text-center" style="border-top:none;"><strong>Price</strong></th>
					    <th class="text-center" style="border-top:none;"><strong>#</strong></th>
					    <th style="border-top:none;"><strong>Total</strong></th>
					</tr>
				</thead>
			{% endif %}
			<tbody>
				{% if ORDER.split %}
					<tr>
						<td class="text-center" colspan="4" style="font-size:125%;">
							<strong>This is a split order. The remainder of your order will arrive in a seperate box. Thank you for your patience. =) <3</strong>
						</td>
					</tr>
				{% else %}
					{% for ID, PRODUCT in ORDER.products %}
						<tr>
							<td>
								{{ PRODUCT.name }}
							</td>
							<td class="text-center">
								${{ "%01.2f"|format(PRODUCT.base_price) }}
							</td>
							<td class="text-center">
								{{ PRODUCT.quantity }}
							</td>
							<td>
								${{ "%01.2f"|format(PRODUCT.total_inc_tax) }}
							</td>
						</tr>
			   		{% endfor %}
					{% if ORDER.coupons or ORDER.coupons is not empty %}
						{% for ID, COUPON in ORDER.coupons %}
							{% if COUPON.code == 'gift' %}
			    				<tr>
			    					<td>
			    						*** FREE GIFT ***
			    					</td>
			    					<td>
			    						$0.00
			    					</td>
			    					<td>
			    						1
			    					</td>
			    					<td>
			    						$0.00
			    					</td>
			    				</tr>
							{% elseif COUPON.code == 'new' %}
			    				<tr>
			    					<td>
			    						FREE BOOKLET
			    					</td>
			    					<td>
			    						$0.00
			    					</td>
			    					<td>
			    						1
			    					</td>
			    					<td>
			    						$0.00
			    					</td>
			    				</tr>
							{% endif %}
						{% endfor %}
					{% endif %}
			   	{% endif %}
   			</tbody>
   			{% if not ORDER.split %}
				<tfoot>
					<tr>
						<th class="text-right" colspan="3" style="padding:.78571429em .78571429em 0 0;">
							<strong>Subtotal</strong>
						</th>
						<th style="padding:.78571429em .78571429em 0 .78571429em ;">
							${{ "%01.2f"|format(ORDER.subtotal_inc_tax) }}
						</th>
					</tr>
					<tr>
						{% if ORDER.customer_message is not empty %}
							<th rowspan="2" style="padding:0 .78571429em;border-top:none;">
								<strong>Customer Message:</strong><br>
								${{ ORDER.customer_message }}
							</th>
						{% endif %}
						<th class="text-right" colspan="{{ ORDER.shipstation.customer_message is empty ? '3' : '2' }}" style="padding:0 .78571429em;border-top:none;">
							<strong>Shipping</strong>
						</th>
						<th style="padding:0 .78571429em;border-top:none;">
							${{ "%01.2f"|format(ORDER.shipping_cost_inc_tax) }}
						</th>
					</tr>
					<!--
						% if ORDER.shipstation.coupons or ORDER.shipstation.coupons is not empty %}
							% for ID, COUPON in ORDER.shipstation.coupons %}
								% if COUPON.code is not 'gift' and COUPON.code is not 'new' or COUPON.split %}
									<tr>
				    					<th class="text-right" colspan="3" style="padding:0 .78571429em;border-top:none;">
				    						<strong>COUPON #{{ COUPON.id }} " COUPON.code|upper }} COUPON.type == 1 ? 
				    						' . $c->coupon_id . ' "' . strtoupper($c->code) . '"' . ' ' . ($c->type == 1 ? number_format($c->amount, 0) . '% OFF' : NULL)  . '</strong>
				    					</th>
				    					<th style="padding:0 .78571429em;border-top:none;">
				    						$- "%01.2f"|format(COUPON.discount) }}
				    					</th>
				    				</tr>
								% endif %}
							% endfor %}
						% endif %}
					-->
					<tr>
						<th class="text-right" colspan="{{ ORDER.shipstation.customer_message is empty ? '3' : '2' }}" style="padding:0 .78571429em;border-top:none;">
							<strong>Credit / Certificate</strong>
						</th>
						<th style="padding:0 .78571429em;border-top:none;">
						 	{% set discount = ORDER.store_credit_amount + ORDER.gift_certificate_amount %}
							$-{{ "%01.2f"|format(discount) }}
						</th>
					</tr>
					<tr>
						<th class="text-right" colspan="3" style="border-top:none;">
							<strong>Total</strong>
						</th>
						<th style="border-top:none;">
							${{ "%01.2f"|format(ORDER.total_inc_tax) }}
						</th>
					</tr>
				</tfoot>
			{% endif %}
			</table>
		<table class="ui two column table text-center" style="margin:0.15in auto;border-color:#999;border-left:none;border-right:none;">
			<tbody>
				<tr>
					<td class="align-middle" style="border-right:1px solid #999;">
						<h4 style="margin:0;">Order Questions?</h4>
						<u>Email us</u> at support@organicstart.com.
					</td>
					<td class="align-middle">
						<h5 style="margin:0;">Translated instructions, ingredients & nutrition labels at OrganicStart.com.</h5>
					</td>
					<!--<td class="align-middle">
						<h4 style="margin:0;">General Questions?</h4>
						<u>Text us</u> at +1(718)971-9733.
					</td>-->
				</tr>
			</tbody>
		</table>
	</div>
    );
}

export default SlipDetail;