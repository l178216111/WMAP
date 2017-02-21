package INF_Block;

sub new {
	my $self = {};
	bless $self;
	shift;
	my $name = shift;
	$self->{name} = $name;
	$self->{data} = ();
	return $self;
}

sub push_data {
	my $self = shift;
	my $data = shift;
	push @{$self->{data}}, $data;
}

sub _pop_data {
	my $self = shift;
	pop @{$self->{data}};
}
sub get_data_by_index {
	my $self = shift;
	my $index = shift;
	return ${$self->{data}}[$index];
}

sub get_data_array {
	my $self = shift;
	return @{$self->{data}};
}

sub blocks {
	my $self = shift;
	my $block_name = shift;
	my @blocks = ();
	foreach my $ref ($self->get_data_array()) {
		if (ref $ref eq "INF_Block") {
			if ($block_name eq "" ) {
				push @blocks, $ref;
			} else {
				if ($ref->{name} =~/$block_name/) {
					push @blocks, $ref;
				}
			}
		}
	}
	return @blocks;
}

sub keys {
	my $self = shift;
	my @keys = ();
	foreach my $ref ($self->get_data_array()) {
		if (ref $ref eq "HASH") {
			push @keys, $ref;
		}
	}
	return @keys;
}

sub block {
	my $self = shift;
	my $block_name = shift;
	die "Please input block name to get Block" if ($block_name eq "");
	foreach my $ref ($self->get_data_array()) {
		if (ref $ref eq "INF_Block" && $ref->{name} eq $block_name) {
			return $ref;
		}
	}
	return;
}

sub key {
	my $self = shift;
	my $key_name = shift;
	die "Please input block name to get Block" if ($key_name eq "");
	my @value;
	foreach my $ref ($self->get_data_array()) {
		if (ref $ref eq "HASH" && $ref->{key} eq $key_name) {
			push @value, $ref->{value};
		}
	}
	if (@value == 0 ) {
		return ();
	} elsif (@value == 1) {
		return $value[0];
	} else {
		return @value;
	}
}

sub getGoodbin {
	my $config = shift;
	my @block = $config->block('SmWaferFlow')->blocks('StBinTable');
	my @list;
	my @GoodBin;

	foreach my $block (@block) {
		if ($block->key('strTag') eq 'PSBN') {
			@list = $block->key('ListData');
		}
	}

	for (my $i=0;$i<@list;$i++) {
		my $line = $list[$i];
		my @split_line = split(//,$line);
		for (my $j=0;$j<@split_line;$j++) {
			my $bin = $i * 32 + $j;
			if ($split_line[$j] == 1) {
				push @GoodBin,$bin;
			}
		}
	}
	return @GoodBin;
}

sub getPasses {
	my $block = shift;
	my $pass_id = shift;
	my $pass_type = shift;
	if ($block->{name} ne 'SmWaferFlow') {
		warn "Suspect wrong block $block->{name} for getting passes, should be SmWaferFlow\n";
	}
	my @passes;
	foreach my $pass ($block->blocks('SmWaferPass')) {
		if ($pass->key('PASS_ID') eq $pass_id && ($pass_type eq "" || $pass->key('PASS_TYPE') eq $pass_type)) {
			push @passes, $pass;
		}
	}
	return @passes;
}

sub getLayers {
	my $block = shift;
	my $layer_name = shift;
	if ($block->{name} ne 'MdMapResult') {
		warn "Suspect wrong block $block->{name} for getting layers, should be MdMapResult\n";
	}
	my @layers;
	foreach my $layer ($block->blocks('NlLayer')) {
		if ($layer->key('strTag') eq $layer_name) {
			push @layers, $layer;
		}
	}
	return @layers;
}
sub getStBinTable {
        my $block = shift;
        my $layer_name = shift;
        if ($block->{name} ne 'SmWaferFlow') {
                warn "Suspect wrong block $block->{name} for getting StBinTable, should be SmWaferPass\n";
        }
        my @layers;
        foreach my $layer ($block->blocks('StBinTable')) {
                if ($layer->key('strKeyword') eq $layer_name) {
                        push @layers, $layer;
                }
        }
        return @layers;
}
sub getListData{
	my $block = shift;
        if ($block->{name} ne 'StBinTable') {
                warn "Suspect wrong block $block->{name} for getting ListData, should be StBinTable\n";
        }
        return $block->key('ListData');
}
sub getRowData {
	my $block = shift;
	if ($block->{name} ne 'NlLayer') {
		warn "Suspect wrong block $block->{name} for getting RowData, should be NlLayer\n";
	}
	return $block->key('RowData');
}
1;
